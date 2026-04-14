using Microsoft.EntityFrameworkCore;
using Customer.API.Models;

namespace Customer.API.Data
{
    public class CustomerDbContext : DbContext
    {
        public CustomerDbContext(DbContextOptions<CustomerDbContext> options) : base(options) { }

        public DbSet<CustomerModel> Customers { get; set; }
    }
}
