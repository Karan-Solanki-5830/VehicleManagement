using Customer.API.DTOs;
using Customer.API.Models;
using Customer.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Customer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [EnableRateLimiting("LoginRateLimit")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var token = await _customerService.LoginAsync(loginDto.Name, loginDto.Password);

            if (token == null)
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(new { Token = token });
        }



        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromForm] RegisterDto customerDto)
        {
            if (customerDto == null)
            {
                return BadRequest("Customer data is required.");
            }

            string? imageUrl = null;
            if (customerDto.Image != null)
            {
                imageUrl = await _customerService.SaveImageAsync(customerDto.Image);
            }

            var customer = new CustomerModel
            {
                Name = customerDto.Name,
                Email = customerDto.Email,
                Phone = customerDto.Phone,
                Address = customerDto.Address,
                Password = customerDto.Password,
                Role = customerDto.Role ?? "User",
                ImageUrl = imageUrl
            };

            await _customerService.CreateCustomerAsync(customer);

            return Ok(new { message = "Registration successful! Please sign in.", customer });
        }

        [HttpGet]
        [Authorize(Roles = "User, Admin")]
        [EnableRateLimiting("ListRateLimit")]
        public async Task<IActionResult> GetCustomers([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string? search = null, [FromQuery] string? role = null)
        {
            return Ok(await _customerService.GetAllCustomersAsync(page, size, search, role));
        }

        [HttpGet("lookup")]
        [Authorize(Roles = "User, Admin")]
        [EnableRateLimiting("ListRateLimit")]
        public async Task<IActionResult> GetCustomersLookup()
        {
            return Ok(await _customerService.GetCustomersLookupAsync());
        }

        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTotalCustomers()
        {
            var count = await _customerService.GetTotalCustomersAsync();
            return Ok(new { success = true, data = count, message = (string?)null });
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        [HttpGet("{id}/bookings")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> GetCustomerBookings(int id)
        {
            var bookings = await _customerService.GetCustomerBookingsAsync(id);
            return Ok(bookings);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostCustomer(CustomerModel customer)
        {
            if (customer == null)
            {
                return BadRequest("Customer data is required.");
            }

            await _customerService.CreateCustomerAsync(customer);

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutCustomer(int id, CustomerModel updatedCustomer)
        {
            if (id != updatedCustomer.Id)
            {
                return BadRequest("ID in URL does not match customer ID.");
            }

            var existingCustomer = await _customerService.GetCustomerByIdAsync(id);
            if (existingCustomer == null)
            {
                return NotFound();
            }

            existingCustomer.Name = updatedCustomer.Name;
            existingCustomer.Email = updatedCustomer.Email;
            existingCustomer.Phone = updatedCustomer.Phone;
            existingCustomer.Address = updatedCustomer.Address;
            if (!string.IsNullOrEmpty(updatedCustomer.Password))
            {
                existingCustomer.Password = updatedCustomer.Password;
            }
            existingCustomer.Role = updatedCustomer.Role;

            await _customerService.UpdateCustomerAsync(existingCustomer);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            await _customerService.DeleteCustomerAsync(id);

            return NoContent();
        }

        [HttpPost("upload-image/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostImage(int id, IFormFile file)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            if (customer == null) return NotFound();

            var imageUrl = await _customerService.SaveImageAsync(file);
            customer.ImageUrl = imageUrl;
            await _customerService.UpdateCustomerAsync(customer);

            return Ok(new { ImageUrl = imageUrl });
        }

        public class FileUploadDto
        {
            public IFormFile file { get; set; }
        }

        [HttpPost("bulk")]
        [Authorize(Roles = "Admin")]
        [EnableRateLimiting("ListRateLimit")]
        public async Task<IActionResult> BulkInsertCustomers([FromForm] FileUploadDto dto)
        {
            if (dto.file == null || dto.file.Length == 0) return BadRequest("No file uploaded.");

            try
            {
                var customers = new List<CustomerModel>();
                using var stream = dto.file.OpenReadStream();
                using var reader = ExcelDataReader.ExcelReaderFactory.CreateReader(stream);

                reader.Read(); // Skip header row

                while (reader.Read())
                {
                    var name = reader.GetValue(0)?.ToString();
                    var email = reader.GetValue(1)?.ToString();

                    if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email)) continue;

                    customers.Add(new CustomerModel
                    {
                        Name = name,
                        Email = email,
                        Phone = reader.GetValue(2)?.ToString() ?? "",
                        Address = reader.GetValue(3)?.ToString() ?? "",
                        Password = reader.GetValue(4)?.ToString() ?? "DefaultPass123",
                        Role = reader.GetValue(5)?.ToString() ?? "User"
                    });
                }

                if (customers.Count == 0) return BadRequest("No valid data found.");

                await _customerService.BulkInsertCustomersAsync(customers);
                return Ok(new { Message = $"Added {customers.Count} customers." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

    }
}