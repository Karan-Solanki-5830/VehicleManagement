using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Vehicle.API.Services.Interfaces;

namespace Vehicle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        [EnableRateLimiting("ListRateLimit")]
        public async Task<IActionResult> GetVehicles([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
        {
            return Ok(await _vehicleService.GetAllVehiclesAsync(page, size, search, status));
        }

        [HttpGet("available")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> GetAvailableVehicles()
        {
            return Ok(await _vehicleService.GetAvailableVehiclesAsync());
        }

        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTotalVehicles()
        {
            var count = await _vehicleService.GetTotalVehiclesAsync();
            return Ok(new { success = true, data = count, message = (string?)null });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            return Ok(vehicle);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostVehicle(Models.Vehicle vehicle)
        {
            if (vehicle == null)
            {
                return BadRequest("Vehicle data is required.");
            }

            await _vehicleService.CreateVehicleAsync(vehicle);

            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutVehicle(int id, Models.Vehicle updatedVehicle)
        {
            if (id != updatedVehicle.Id)
            {
                return BadRequest("ID in URL does not match vehicle ID.");
            }

            var existingVehicle = await _vehicleService.GetVehicleByIdAsync(id);
            if (existingVehicle == null)
            {
                return NotFound();
            }

            existingVehicle.VehicleNumber = updatedVehicle.VehicleNumber;
            existingVehicle.Model = updatedVehicle.Model;
            existingVehicle.Type = updatedVehicle.Type;
            existingVehicle.Capacity = updatedVehicle.Capacity;
            existingVehicle.Status = updatedVehicle.Status;

            await _vehicleService.UpdateVehicleAsync(existingVehicle);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            await _vehicleService.DeleteVehicleAsync(id);

            return NoContent();
        }
    }
}
