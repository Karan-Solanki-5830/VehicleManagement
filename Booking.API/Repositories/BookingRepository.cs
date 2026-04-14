using Booking.API.Data;
using Booking.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Booking.API.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly BookingDbContext _context;

        public BookingRepository(BookingDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Booking> CreateAsync(Models.Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<Models.Booking?> GetByIdAsync(int id)
        {
            return await _context.Bookings.FindAsync(id);
        }

        public async Task<Models.Booking> UpdateAsync(Models.Booking booking)
        {
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<(IEnumerable<Models.Booking> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? status = null)
        {
            var query = _context.Bookings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                if (int.TryParse(search, out int id))
                {
                    query = query.Where(b => b.Id == id || b.CustomerId == id || b.VehicleId == id);
                }
                else
                {
                    query = query.Where(b => b.Status.Contains(search));
                }
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(b => b.Status == status);
            }

            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(b => b.Id).Skip((page - 1) * size).Take(size).ToListAsync();
            return (items, totalCount);
        }

        public async Task<IEnumerable<Models.Booking>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.Bookings.Where(b => b.CustomerId == customerId).ToListAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking != null)
            {
                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> IsVehicleAvailableAsync(int vehicleId, DateTime start, DateTime end, int? excludeBookingId = null)
        {
            var startDate = start.Date;
            var endDate = end.Date.AddDays(1).AddTicks(-1);

            return !await _context.Bookings.AnyAsync(b =>
                b.VehicleId == vehicleId &&
                (!excludeBookingId.HasValue || b.Id != excludeBookingId.Value) &&
                b.Status != "Cancelled" && b.Status != "Failed" &&
                b.BookingDate <= endDate &&
                (b.ReturnDate == null || b.ReturnDate >= startDate));
        }
    }
}
