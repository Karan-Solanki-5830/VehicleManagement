using Vehicle.API.Services.Interfaces;
using Vehicle.API.Repositories.Interfaces;
using Vehicle.API.DTOs;

namespace Vehicle.API.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _vehicleRepository;

        public VehicleService(IVehicleRepository vehicleRepository)
        {
            _vehicleRepository = vehicleRepository;
        }

        public async Task<PagedResult<Models.Vehicle>> GetAllVehiclesAsync(int page, int size, string? search = null, string? status = null)
        {
            var (items, totalCount) = await _vehicleRepository.GetAllAsync(page, size, search, status);
            
            return new PagedResult<Models.Vehicle>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = size
            };
        }

        public async Task<IEnumerable<VehicleLookupDto>> GetAvailableVehiclesAsync()
        {
            var vehicles = await _vehicleRepository.GetAvailableAsync();
            return vehicles.Select(v => new VehicleLookupDto
            {
                Id = v.Id,
                VehicleNumber = v.VehicleNumber
            });
        }

        public async Task<Models.Vehicle?> GetVehicleByIdAsync(int id)
        {
            return await _vehicleRepository.GetByIdAsync(id);
        }

        public async Task<Models.Vehicle> CreateVehicleAsync(Models.Vehicle vehicle)
        {
            return await _vehicleRepository.CreateAsync(vehicle);
        }

        public async Task UpdateVehicleAsync(Models.Vehicle vehicle)
        {
            await _vehicleRepository.UpdateAsync(vehicle);
        }

        public async Task DeleteVehicleAsync(int id)
        {
            await _vehicleRepository.DeleteAsync(id);
        }

        public async Task<int> GetTotalVehiclesAsync()
        {
            var (_, totalCount) = await _vehicleRepository.GetAllAsync(1, 1, null, null);
            return totalCount;
        }
    }
}
