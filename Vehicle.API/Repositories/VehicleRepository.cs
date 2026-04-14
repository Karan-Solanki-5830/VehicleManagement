using Microsoft.EntityFrameworkCore;
using Vehicle.API.Repositories.Interfaces;

namespace Vehicle.API.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VehicleDbContext _context;

        public VehicleRepository(VehicleDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Vehicle> CreateAsync(Models.Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task<Models.Vehicle?> GetByIdAsync(int id)
        {
            return await _context.Vehicles.FindAsync(id);
        }

        public async Task UpdateAsync(Models.Vehicle vehicle)
        {
            _context.Vehicles.Update(vehicle);
            await _context.SaveChangesAsync();
        }

        public async Task<(IEnumerable<Models.Vehicle> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? status = null)
        {
            var query = _context.Vehicles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                if (int.TryParse(search, out int id))
                {
                    query = query.Where(v => v.Id == id);
                }
                else
                {
                    query = query.Where(v =>
                        v.VehicleNumber.Contains(search) ||
                        v.Model.Contains(search));
                }
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(v => v.Status == status);
            }

            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * size).Take(size).ToListAsync();
            return (items, totalCount);
        }

        public async Task<IEnumerable<Models.Vehicle>> GetAvailableAsync()
        {
            return await _context.Vehicles.Where(v => v.Status.ToLower() == "available").ToListAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle != null)
            {
                _context.Vehicles.Remove(vehicle);
                await _context.SaveChangesAsync();
            }
        }


    }
}
