using Customer.API.Models;

namespace Customer.API.Repositories.Interfaces;
public interface ICustomerRepository
{
    Task<(IEnumerable<CustomerModel> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? role = null);
    Task<CustomerModel?> GetByIdAsync(int id);
    Task<int> CreateAsync(CustomerModel customer);
    Task<bool> UpdateAsync(CustomerModel customer);
    Task<bool> DeleteAsync(int id);
    Task<List<CustomerModel>> BulkInsertAsync(List<CustomerModel> customers);
    Task<CustomerModel?> GetByNameAsync(string name);
}

