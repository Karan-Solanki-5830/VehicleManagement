using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Payment.API.DTOs;
using Payment.API.Repositories.Interfaces;
using Payment.API.Services.Interfaces;

namespace Payment.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly Messaging.RabbitMqPublisher _publisher;
        private readonly IDistributedCache _cache;
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const string AllPaymentsCacheKey = "AllPayments_v2";

        public PaymentService(IPaymentRepository paymentRepository, Messaging.RabbitMqPublisher publisher, IDistributedCache cache, HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
        {
            _paymentRepository = paymentRepository;
            _publisher = publisher;
            _cache = cache;
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<PagedResult<Models.Payment>> GetAllPaymentsAsync(int page, int size, string? search = null, string? method = null, bool? isPaid = null)
        {
            IEnumerable<Models.Payment> items;
            int totalCount;

            var cacheKey = $"{AllPaymentsCacheKey}_{page}_{size}_{search}_{method}_{isPaid}";
            var cachedData = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedData))
            {
                try
                {
                    var result = JsonSerializer.Deserialize<PagedResult<Models.Payment>>(cachedData);
                    if (result != null) return result;
                }
                catch { }
            }

            (items, totalCount) = await _paymentRepository.GetAllAsync(page, size, search, method, isPaid);

            var pagedResult = new PagedResult<Models.Payment>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = size
            };

            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(20) };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(pagedResult), cacheOptions);

            return pagedResult;
        }

        public async Task<IEnumerable<Payment.API.DTOs.BookingLookupDto>> GetBookingLookupsAsync()
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
            HttpRequestMessage CreateRequest(string url)
            {
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                if (!string.IsNullOrEmpty(token) && System.Net.Http.Headers.AuthenticationHeaderValue.TryParse(token, out var hv))
                    request.Headers.Authorization = hv;
                return request;
            }

            var bookings = new List<JsonElement>();
            try
            {
                var resp = await _httpClient.SendAsync(CreateRequest("http://bookingapi.runasp.net/api/Bookings?page=1&size=10000"));
                if (resp.IsSuccessStatusCode)
                {
                    var res = await resp.Content.ReadFromJsonAsync<JsonElement>();
                    if (res.ValueKind == JsonValueKind.Object && res.TryGetProperty("items", out var items))
                        bookings.AddRange(items.EnumerateArray());
                }
            }
            catch (Exception ex) { Console.WriteLine($"Error bookings: {ex.Message}"); }

            var customers = new List<JsonElement>();
            try
            {
                var resp = await _httpClient.SendAsync(CreateRequest("http://custtapi.runasp.net/api/Customers/lookup"));
                if (resp.IsSuccessStatusCode)
                {
                    var res = await resp.Content.ReadFromJsonAsync<JsonElement>();
                    if (res.ValueKind == JsonValueKind.Array) customers.AddRange(res.EnumerateArray());
                }
            }
            catch (Exception ex) { Console.WriteLine($"Error customers: {ex.Message}"); }

            var vehicles = new List<JsonElement>();
            try
            {
                var resp = await _httpClient.SendAsync(CreateRequest("http://vehicleapi.runasp.net/api/Vehicles?page=1&size=10000"));
                if (resp.IsSuccessStatusCode)
                {
                    var res = await resp.Content.ReadFromJsonAsync<JsonElement>();
                    if (res.ValueKind == JsonValueKind.Object && res.TryGetProperty("items", out var items))
                        vehicles.AddRange(items.EnumerateArray());
                }
            }
            catch (Exception ex) { Console.WriteLine($"Error vehicles: {ex.Message}"); }

            var lookups = new List<BookingLookupDto>();
            foreach (var b in bookings)
            {
                var status = b.TryGetProperty("status", out var sToken) ? sToken.GetString() : null;
                if (!string.Equals(status, "Pending", StringComparison.OrdinalIgnoreCase))
                    continue;

                int bId = b.GetProperty("id").GetInt32();
                int cId = b.GetProperty("customerId").GetInt32();
                int vId = b.GetProperty("vehicleId").GetInt32();

                var cust = customers.FirstOrDefault(c => c.GetProperty("id").GetInt32() == cId);
                var veh = vehicles.FirstOrDefault(v => v.GetProperty("id").GetInt32() == vId);

                lookups.Add(new BookingLookupDto
                {
                    BookingId = bId,
                    CustomerId = cId,
                    CustomerName = cust.ValueKind != JsonValueKind.Undefined ? cust.GetProperty("name").GetString() ?? "Unknown" : "Unknown",
                    VehicleId = vId,
                    VehicleNumber = veh.ValueKind != JsonValueKind.Undefined ? veh.GetProperty("vehicleNumber").GetString() ?? "Unknown" : "Unknown"
                });
            }
            return lookups;
        }

        public async Task<Models.Payment?> GetPaymentByIdAsync(int id) => await _paymentRepository.GetByIdAsync(id);

        public async Task<Models.Payment> CreatePaymentAsync(Models.Payment payment)
        {
            var created = await _paymentRepository.CreateAsync(payment);

            _publisher.PublishPaymentCreated(new Messaging.PaymentCreatedEvent { Id = created.Id, BookingId = created.BookingId, Amount = created.Amount, PaymentDate = created.PaymentDate });
            return created;
        }

        public async Task UpdatePaymentAsync(Models.Payment payment)
        {
            await _paymentRepository.UpdateAsync(payment);

        }

        public async Task DeletePaymentAsync(int id)
        {
            await _paymentRepository.DeleteAsync(id);

        }

        public async Task<decimal> GetTotalRevenueAsync(string? period = null)
        {
            var (payments, _) = await _paymentRepository.GetAllAsync(1, 100000, null, null, null);
            var query = payments.Where(p => p.IsPaid);

            if (period == "month")
            {
                var now = DateTime.UtcNow;
                query = query.Where(p => p.PaymentDate.Year == now.Year && p.PaymentDate.Month == now.Month);
            }
            else if (period == "year")
            {
                var now = DateTime.UtcNow;
                query = query.Where(p => p.PaymentDate.Year == now.Year);
            }

            return query.Sum(p => p.Amount);
        }

        public async Task<IEnumerable<DailyRevenueDto>> GetDailyRevenueAsync()
        {
            var (payments, _) = await _paymentRepository.GetAllAsync(1, 100000, null, null, null);
            return payments.Where(p => p.IsPaid)
                .GroupBy(p => p.PaymentDate.Date)
                .Select(g => new DailyRevenueDto { Date = g.Key.ToString("MMM dd"), Revenue = g.Sum(p => p.Amount) })
                .OrderBy(d => DateTime.ParseExact(d.Date, "MMM dd", System.Globalization.CultureInfo.InvariantCulture));
        }

        public async Task<IEnumerable<DailyRevenueDto>> GetMonthlyRevenueAsync()
        {
            var (payments, _) = await _paymentRepository.GetAllAsync(1, 100000, null, null, null);
            return payments.Where(p => p.IsPaid)
                .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
                .Select(g => new DailyRevenueDto 
                { 
                    Date = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"), 
                    Revenue = g.Sum(p => p.Amount) 
                })
                .OrderBy(d => DateTime.ParseExact(d.Date, "MMM yyyy", System.Globalization.CultureInfo.InvariantCulture));
        }

        public async Task<IEnumerable<DailyRevenueDto>> GetYearlyRevenueAsync()
        {
            var (payments, _) = await _paymentRepository.GetAllAsync(1, 100000, null, null, null);
            return payments.Where(p => p.IsPaid)
                .GroupBy(p => p.PaymentDate.Year)
                .Select(g => new DailyRevenueDto 
                { 
                    Date = g.Key.ToString(), 
                    Revenue = g.Sum(p => p.Amount) 
                })
                .OrderBy(d => int.Parse(d.Date));
        }
    }
}
