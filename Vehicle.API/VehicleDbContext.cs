using Microsoft.EntityFrameworkCore;

namespace Vehicle.API
{
    public class VehicleDbContext : DbContext
    {
        public VehicleDbContext(DbContextOptions<VehicleDbContext> options) : base(options) { }

        public DbSet<Models.Vehicle> Vehicles { get; set; }
    }
}
