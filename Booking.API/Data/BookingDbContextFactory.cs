using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Booking.API.Data;

namespace Booking.API.Data
{
    public class BookingDbContextFactory : IDesignTimeDbContextFactory<BookingDbContext>
    {
        public BookingDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BookingDbContext>();

            string connectionString = "Server=db44042.databaseasp.net; Database=db44042; User Id=db44042; Password=6e#P=Df9r3R!; Encrypt=False; TrustServerCertificate=True;";
            
            optionsBuilder.UseSqlServer(connectionString);

            return new BookingDbContext(optionsBuilder.Options);
        }
    }
}
