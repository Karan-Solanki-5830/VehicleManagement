using Booking.API.DTOs;

namespace Booking.API.Services.Interfaces
{
    public interface IBookingService
    {
        Task<Booking.API.Models.Booking> CreateBookingAsync(
            Booking.API.Models.Booking booking
        );

        Task<Booking.API.Models.Booking?> GetBookingByIdAsync(int id);

        Task<Booking.API.Models.Booking> UpdateBookingAsync(
            Booking.API.Models.Booking booking
        );

        Task<PagedResult<Booking.API.Models.Booking>> GetAllBookingsAsync(int page, int size, string? search = null, string? status = null);
        Task<IEnumerable<Booking.API.Models.Booking>> GetBookingsByCustomerIdAsync(int customerId);
        Task DeleteBookingAsync(int id);
        Task<int> GetTotalBookingsAsync();
    }
}
