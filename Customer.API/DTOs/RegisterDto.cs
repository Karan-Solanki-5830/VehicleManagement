using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Customer.API.DTOs
{
    public class RegisterDto
    {
        [FromForm(Name = "name")] public string Name { get; set; } = string.Empty;
        [FromForm(Name = "email")] public string Email { get; set; } = string.Empty;
        [FromForm(Name = "phone")] public string Phone { get; set; } = string.Empty;
        [FromForm(Name = "address")] public string Address { get; set; } = string.Empty;
        [FromForm(Name = "password")] public string Password { get; set; } = string.Empty;
        [FromForm(Name = "role")] public string Role { get; set; } = "User";
        [FromForm(Name = "image")] public IFormFile? Image { get; set; }
    }
}
