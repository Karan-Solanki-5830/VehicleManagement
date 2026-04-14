using System;
using System.Threading.Tasks;
using System.Globalization;
using System.Text.Json;
using System.Linq;
using System.Collections.Generic;
using ApiGateway.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ApiGateway.Controllers
{
    [ApiController, Route("api/[controller]"), Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IHttpClientFactory _http;
        private readonly IConfiguration _config;

        public DashboardController(IHttpClientFactory http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetStats([FromQuery] string? period = null)
        {
            var t1 = Get<decimal>("Customer", "count");
            var t2 = Get<decimal>("Vehicle", "count");
            var t3 = Get<decimal>("Booking", "count");
            var t4 = Get<decimal>("Payment", $"total?period={period}");

            try { await Task.WhenAll(t1, t2, t3, t4); } catch { }

            return Ok(new { 
                totalCustomers = (int)t1.Result, 
                totalVehicles = (int)t2.Result, 
                totalBookings = (int)t3.Result, 
                totalRevenue = t4.Result 
            });
        }

        [HttpGet("chart")]
        public async Task<IActionResult> GetChart([FromQuery] string view = "daily")
        {
            var path = view == "monthly" ? "chart/monthly" : view == "yearly" ? "chart/yearly" : "chart";
            return Content(await Call("Payment", path), "application/json");
        }

        [HttpGet("recent-bookings")]
        public async Task<IActionResult> GetRecent()
        {
            var pJson = await Call("Payment", "?page=1&size=5", true);
            var lJson = await Call("Payment", "bookings/lookup", true);

            try
            {
                var paymentsDoc = JsonDocument.Parse(pJson);
                if (!paymentsDoc.RootElement.TryGetProperty("items", out var itemsElement) || itemsElement.ValueKind != JsonValueKind.Array)
                {
                    return Ok(new List<object>());
                }

                var payments = itemsElement.EnumerateArray();
                var lookupsDoc = JsonDocument.Parse(lJson);
                var lookups = lookupsDoc.RootElement.ValueKind == JsonValueKind.Array 
                    ? lookupsDoc.RootElement.EnumerateArray().ToList()
                    : new List<JsonElement>();

                return Ok(payments.Select(p => {
                    int bId = 0;
                    if (p.TryGetProperty("bookingId", out var bIdProp)) bId = bIdProp.GetInt32();
                    
                    var l = lookups.FirstOrDefault(x => x.TryGetProperty("bookingId", out var lid) && lid.GetInt32() == bId);
                    
                    decimal amount = 0;
                    if (p.TryGetProperty("amount", out var amtProp)) amount = amtProp.GetDecimal();
                    
                    int id = 0;
                    if (p.TryGetProperty("id", out var idProp)) id = idProp.GetInt32();

                    DateTime date = DateTime.MinValue;
                    if (p.TryGetProperty("paymentDate", out var dateProp)) date = dateProp.GetDateTime();

                    return new {
                        id = id,
                        amount = amount,
                        customerName = l.ValueKind != JsonValueKind.Undefined && l.TryGetProperty("customerName", out var cn) ? cn.GetString() : "Unknown",
                        vehicleNumber = l.ValueKind != JsonValueKind.Undefined && l.TryGetProperty("vehicleNumber", out var vn) ? vn.GetString() : "Unknown",
                        paymentDate = date
                    };
                }));
            }
            catch { return Ok(new List<object>()); }
        }

        private async Task<T> Get<T>(string svc, string path)
        {
            var res = await Call(svc, path);
            if (res.Trim().StartsWith("{")) {
                var api = JsonSerializer.Deserialize<ApiResponse<T>>(res, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return api?.Success == true ? api.Data : default!;
            }
            return (T)Convert.ChangeType(res, typeof(T), CultureInfo.InvariantCulture);
        }

        private async Task<string> Call(string svc, string path, bool auth = false)
        {
            try {
                var url = $"{(_config[$"Services:{svc}"] ?? $"http://localhost:5000/api/{svc.ToLower()}s")}/{path.TrimStart('/')}";
                var client = _http.CreateClient();
                if (auth && Request.Headers.TryGetValue("Authorization", out var h)) client.DefaultRequestHeaders.Add("Authorization", h.ToString());
                return await client.GetStringAsync(url);
            } catch { return "{}"; }
        }
    }
}
