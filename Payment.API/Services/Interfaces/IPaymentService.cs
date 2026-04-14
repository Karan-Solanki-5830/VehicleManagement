
using Payment.API.Models;

using Payment.API.DTOs;

namespace Payment.API.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PagedResult<Models.Payment>> GetAllPaymentsAsync(int page, int size, string? search = null, string? method = null, bool? isPaid = null);
        Task<IEnumerable<Payment.API.DTOs.BookingLookupDto>> GetBookingLookupsAsync();
        Task<Models.Payment?> GetPaymentByIdAsync(int id);
        Task<Models.Payment> CreatePaymentAsync(Models.Payment payment);
        Task UpdatePaymentAsync(Models.Payment payment);
        Task DeletePaymentAsync(int id);
        Task<decimal> GetTotalRevenueAsync(string? period = null);
        Task<IEnumerable<Payment.API.DTOs.DailyRevenueDto>> GetDailyRevenueAsync();
        Task<IEnumerable<Payment.API.DTOs.DailyRevenueDto>> GetMonthlyRevenueAsync();
        Task<IEnumerable<Payment.API.DTOs.DailyRevenueDto>> GetYearlyRevenueAsync();
    }
}
