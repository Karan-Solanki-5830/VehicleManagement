using Payment.API.Models;

namespace Payment.API.Repositories.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Models.Payment> CreateAsync(Models.Payment payment);
        Task<Models.Payment?> GetByIdAsync(int id);
        Task UpdateAsync(Models.Payment payment);
        Task<(IEnumerable<Models.Payment> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? method = null, bool? isPaid = null);
        Task DeleteAsync(int id);
    }
}
