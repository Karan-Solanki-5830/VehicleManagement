using Vehicle.API.Models;

namespace Vehicle.API.Repositories.Interfaces
{
    public interface IVehicleRepository
    {
        Task<Models.Vehicle> CreateAsync(Models.Vehicle vehicle);
        Task<Models.Vehicle?> GetByIdAsync(int id);
        Task UpdateAsync(Models.Vehicle vehicle);
        Task<(IEnumerable<Models.Vehicle> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? status = null);
        Task<IEnumerable<Models.Vehicle>> GetAvailableAsync();
        Task DeleteAsync(int id);
    }
}
