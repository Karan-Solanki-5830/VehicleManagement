
using Customer.API.Models;
using Customer.API.DTOs;

namespace Customer.API.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<PagedResult<CustomerModel>> GetAllCustomersAsync(int page, int size, string? search = null, string? role = null);
        Task<IEnumerable<CustomerLookupDto>> GetCustomersLookupAsync();
        Task<CustomerModel?> GetCustomerByIdAsync(int id);
        Task<CustomerModel> CreateCustomerAsync(CustomerModel customer);
        Task UpdateCustomerAsync(CustomerModel customer);
        Task DeleteCustomerAsync(int id);
        Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(int customerId);
        Task<List<CustomerModel>> BulkInsertCustomersAsync(List<CustomerModel> customers);
        Task<string?> LoginAsync(string name, string password);
        Task<int> GetTotalCustomersAsync();
        Task<string> SaveImageAsync(IFormFile file);
    }
}
