using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Customer.API.DTOs;
using Customer.API.Models;
using Customer.API.Repositories.Interfaces;
using Customer.API.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;

namespace Customer.API.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;
        private const string AllCustomersCacheKey = "AllCustomers";

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _environment;

        private readonly Supabase.Client _supabaseClient;

        public CustomerService(ICustomerRepository customerRepository, HttpClient httpClient, IMemoryCache cache, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, Supabase.Client supabaseClient)
        {
            _customerRepository = customerRepository;
            _httpClient = httpClient;
            _cache = cache;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _environment = environment;
            _supabaseClient = supabaseClient;
        }

        // ... existing methods ...

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            var bucketName = _configuration["Supabase:Bucket"] ?? "Avatars";

            // 1. Upload the raw bytes to your bucket
            await _supabaseClient.Storage
                .From(bucketName)
                .Upload(fileBytes, uniqueFileName);

            // 2. Generate the permanent Public URL that anyone can use to view the image
            var publicUrl = _supabaseClient.Storage
                .From(bucketName)
                .GetPublicUrl(uniqueFileName);

            return publicUrl;
        }

        public async Task<PagedResult<CustomerModel>> GetAllCustomersAsync(int page, int size, string? search = null, string? role = null)
        {
            var cacheKey = $"Customers_{page}_{size}_{search}_{role}";

            if (_cache.TryGetValue(cacheKey, out PagedResult<CustomerModel>? cachedResult) && cachedResult != null)
            {
                return cachedResult;
            }

            var (items, totalCount) = await _customerRepository.GetAllAsync(page, size, search, role);

            var result = new PagedResult<CustomerModel>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = size
            };

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromSeconds(20));

            _cache.Set(cacheKey, result, cacheOptions);

            return result;
        }

        public async Task<IEnumerable<CustomerLookupDto>> GetCustomersLookupAsync()
        {
             // For lookup, we likely want all, fetching a large page or dedicated method is best.
             // Using page 1, size 10000 for now to cover likely usage.
             var (items, _) = await _customerRepository.GetAllAsync(1, 10000);
             return items.Select(c => new CustomerLookupDto
             {
                 Id = c.Id,
                 Name = c.Name
             });
        }

        public async Task<CustomerModel?> GetCustomerByIdAsync(int id)
        {
            return await _customerRepository.GetByIdAsync(id);
        }

        public async Task<CustomerModel> CreateCustomerAsync(CustomerModel customer)
        {
            var id = await _customerRepository.CreateAsync(customer);
            customer.Id = id;
            return customer;
        }

        public async Task UpdateCustomerAsync(CustomerModel customer)
        {
            await _customerRepository.UpdateAsync(customer);
        }

        public async Task DeleteCustomerAsync(int id)
        {
            await _customerRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(int customerId)
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(token))
            {
                _httpClient.DefaultRequestHeaders.Authorization = System.Net.Http.Headers.AuthenticationHeaderValue.Parse(token);
            }

            var response = await _httpClient.GetAsync($"http://bookingapi.runasp.net/api/Bookings/customer/{customerId}");

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<IEnumerable<BookingDto>>() ?? new List<BookingDto>();
            }

            return new List<BookingDto>();
        }

        public async Task<List<CustomerModel>> BulkInsertCustomersAsync(List<CustomerModel> customers)
        {
            return await _customerRepository.BulkInsertAsync(customers);
        }

        public async Task<string?> LoginAsync(string name, string password)
        {
            var customer = await _customerRepository.GetByNameAsync(name);

            if (customer == null || customer.Password != password)
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                    new Claim(ClaimTypes.Name, customer.Name),
                    new Claim(ClaimTypes.Email, customer.Email),
                    new Claim(ClaimTypes.Role, customer.Role),
                    new Claim("ImageUrl", customer.ImageUrl ?? "/uploads/Default_Image.jpg")
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<int> GetTotalCustomersAsync()
        {
            var (_, totalCount) = await _customerRepository.GetAllAsync(1, 1);
            return totalCount;
        }
    }
}
