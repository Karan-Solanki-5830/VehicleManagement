using Booking.API.Models;

namespace Booking.API.Repositories.Interfaces
{
    public interface IBookingRepository
    {
        Task<Models.Booking> CreateAsync(Models.Booking booking);
        Task<Models.Booking?> GetByIdAsync(int id);
        Task<Models.Booking> UpdateAsync(Models.Booking booking);
        Task<(IEnumerable<Models.Booking> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? status = null);
        Task<IEnumerable<Models.Booking>> GetByCustomerIdAsync(int customerId);
        Task DeleteAsync(int id);
        Task<bool> IsVehicleAvailableAsync(int vehicleId, DateTime start, DateTime end, int? excludeBookingId = null);
    }
}
