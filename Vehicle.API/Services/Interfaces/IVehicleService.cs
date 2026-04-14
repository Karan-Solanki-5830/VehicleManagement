using Vehicle.API.Models;
using Vehicle.API.DTOs;

namespace Vehicle.API.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<PagedResult<Models.Vehicle>> GetAllVehiclesAsync(int page, int size, string? search = null, string? status = null);
        Task<IEnumerable<VehicleLookupDto>> GetAvailableVehiclesAsync();
        Task<Models.Vehicle?> GetVehicleByIdAsync(int id);
        Task<Models.Vehicle> CreateVehicleAsync(Models.Vehicle vehicle);
        Task UpdateVehicleAsync(Models.Vehicle vehicle);
        Task DeleteVehicleAsync(int id);
        Task<int> GetTotalVehiclesAsync();
    }
}
