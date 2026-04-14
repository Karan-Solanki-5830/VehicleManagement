using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Payment.API.Services.Interfaces;

namespace Payment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [EnableRateLimiting("ListRateLimit")]
        public async Task<IActionResult> GetPayments([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string? search = null, [FromQuery] string? method = null, [FromQuery] bool? isPaid = null)
        {
            return Ok(await _paymentService.GetAllPaymentsAsync(page, size, search, method, isPaid));
        }

        [HttpGet("total")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTotalRevenue([FromQuery] string? period = null)
        {
            var revenue = await _paymentService.GetTotalRevenueAsync(period);
            return Ok(new { success = true, data = revenue, message = (string?)null });
        }

        [HttpGet("chart")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDailyRevenue()
        {
            return Ok(await _paymentService.GetDailyRevenueAsync());
        }

        [HttpGet("chart/monthly")]
        [AllowAnonymous]
        public async Task<IActionResult> GetMonthlyRevenue()
        {
            return Ok(await _paymentService.GetMonthlyRevenueAsync());
        }

        [HttpGet("chart/yearly")]
        [AllowAnonymous]
        public async Task<IActionResult> GetYearlyRevenue()
        {
            return Ok(await _paymentService.GetYearlyRevenueAsync());
        }

        [HttpGet("bookings/lookup")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBookingLookups()
        {
            return Ok(await _paymentService.GetBookingLookupsAsync());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return Ok(payment);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostPayment(Models.Payment payment)
        {
            if (payment == null)
            {
                return BadRequest("Payment data is required.");
            }

            await _paymentService.CreatePaymentAsync(payment);

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutPayment(int id, Models.Payment updatedPayment)
        {
            if (id != updatedPayment.Id)
            {
                return BadRequest("ID in URL does not match payment ID.");
            }

            var existingPayment = await _paymentService.GetPaymentByIdAsync(id);
            if (existingPayment == null)
            {
                return NotFound();
            }

            existingPayment.BookingId = updatedPayment.BookingId;
            existingPayment.Amount = updatedPayment.Amount;
            existingPayment.PaymentMethod = updatedPayment.PaymentMethod;
            existingPayment.IsPaid = updatedPayment.IsPaid;
            existingPayment.PaymentDate = updatedPayment.PaymentDate;

            await _paymentService.UpdatePaymentAsync(existingPayment);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            await _paymentService.DeletePaymentAsync(id);

            return NoContent();
        }
    }
}
