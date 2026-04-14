using Booking.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;

namespace Booking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRequestService _bookingRequestService;
        private readonly IBookingService _bookingService;

        public BookingsController(
            IBookingService bookingService,
            IBookingRequestService bookingRequestService
        )
        {
            _bookingService = bookingService;
            _bookingRequestService = bookingRequestService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [EnableRateLimiting("ListRateLimit")]
        public async Task<IActionResult> GetBookings([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
        {
            return Ok(await _bookingService.GetAllBookingsAsync(page, size, search, status));
        }

        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTotalBookings()
        {
            var count = await _bookingService.GetTotalBookingsAsync();
            return Ok(new { success = true, data = count, message = (string?)null });
        }

        [HttpGet("customer/{customerId}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> GetBookingsByCustomer(int customerId)
        {
            return Ok(await _bookingService.GetBookingsByCustomerIdAsync(customerId));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBooking(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return Ok(booking);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> CreateBooking(Booking.API.Models.Booking booking)
        {
            try
            {
                var result = await _bookingRequestService.CreateBookingRequestAsync(booking);

                return Ok(new
                {
                    Message = "Booking request created successfully",
                    BookingId = result.Id,
                    Status = result.Status
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }



        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutBooking(int id, Models.Booking updatedBooking)
        {
            if (id != updatedBooking.Id)
            {
                return BadRequest("ID in URL does not match booking ID.");
            }

            var existingBooking = await _bookingService.GetBookingByIdAsync(id);
            if (existingBooking == null)
            {
                return NotFound();
            }

            existingBooking.CustomerId = updatedBooking.CustomerId;
            existingBooking.VehicleId = updatedBooking.VehicleId;
            existingBooking.BookingDate = updatedBooking.BookingDate;
            existingBooking.ReturnDate = updatedBooking.ReturnDate;
            existingBooking.Price = updatedBooking.Price;
            existingBooking.Status = updatedBooking.Status;

            try
            {
                await _bookingService.UpdateBookingAsync(existingBooking);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            await _bookingService.DeleteBookingAsync(id);

            return NoContent();
        }

    }
}
