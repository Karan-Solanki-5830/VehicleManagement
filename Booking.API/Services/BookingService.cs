using Booking.API.DTOs;
using Booking.API.Repositories.Interfaces;
using Booking.API.Services.Interfaces;

namespace Booking.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IEmailService _emailService;

        public BookingService(IBookingRepository bookingRepository, IEmailService emailService)
        {
            _bookingRepository = bookingRepository;
            _emailService = emailService;
        }

        public async Task<Models.Booking> CreateBookingAsync(Models.Booking booking)
        {
            // Availability Check
            var checkEnd = booking.ReturnDate ?? booking.BookingDate;
            if (!await _bookingRepository.IsVehicleAvailableAsync(booking.VehicleId, booking.BookingDate, checkEnd))
            {
                throw new InvalidOperationException("Vehicle is not available for the selected dates.");
            }

            var createdBooking = await _bookingRepository.CreateAsync(booking);

            // 1. FIRE-AND-FORGET JOB:
            // This runs the task immediately in the background. 
            // The API will NOT wait for this to finish (perfect for slow tasks like sending emails).
            // Hangfire.BackgroundJob.Enqueue(() => _emailService.SendBookingConfirmation(createdBooking.Id));

            // 2. DELAYED JOB:
            // This schedules a task to run at a specific time in the future.
            // Here we wait 2 minutes to simulate a reminder notification.
            /*
            Hangfire.BackgroundJob.Schedule(
                () => _emailService.SendReturnReminder(createdBooking.Id),
                TimeSpan.FromMinutes(2));
            */

            return createdBooking;
        }

        public async Task<Models.Booking?> GetBookingByIdAsync(int id)
        {
            return await _bookingRepository.GetByIdAsync(id);
        }

        public async Task<Models.Booking> UpdateBookingAsync(Models.Booking booking)
        {
            if (booking.Status != "Cancelled" && booking.Status != "Failed")
            {
                var checkEnd = booking.ReturnDate ?? booking.BookingDate;
                if (!await _bookingRepository.IsVehicleAvailableAsync(booking.VehicleId, booking.BookingDate, checkEnd, booking.Id))
                {
                    throw new InvalidOperationException("Vehicle is not available for the selected dates.");
                }
            }
            return await _bookingRepository.UpdateAsync(booking);
        }

        public async Task<PagedResult<Models.Booking>> GetAllBookingsAsync(int page, int size, string? search = null, string? status = null)
        {
            var (items, totalCount) = await _bookingRepository.GetAllAsync(page, size, search, status);

            return new PagedResult<Models.Booking>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = size
            };
        }

        public async Task<IEnumerable<Models.Booking>> GetBookingsByCustomerIdAsync(int customerId)
        {
            return await _bookingRepository.GetByCustomerIdAsync(customerId);
        }

        public async Task DeleteBookingAsync(int id)
        {
            await _bookingRepository.DeleteAsync(id);
        }

        public async Task<int> GetTotalBookingsAsync()
        {
            var (_, totalCount) = await _bookingRepository.GetAllAsync(1, 1, null, null);
            return totalCount;
        }
    }
}
