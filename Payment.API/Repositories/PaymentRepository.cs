using Payment.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Payment.API.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly PaymentDbContext _context;

        public PaymentRepository(PaymentDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Payment> CreateAsync(Models.Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<Models.Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments.FindAsync(id);
        }

        public async Task UpdateAsync(Models.Payment payment)
        {
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
        }

        public async Task<(IEnumerable<Models.Payment> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? method = null, bool? isPaid = null)
        {
            var query = _context.Payments.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                if (int.TryParse(search, out int id))
                {
                    // Search by Payment ID OR Booking ID
                    query = query.Where(p => p.Id == id || p.BookingId == id);
                }
            }

            if (!string.IsNullOrWhiteSpace(method))
            {
                query = query.Where(p => p.PaymentMethod == method);
            }

            if (isPaid.HasValue)
            {
                query = query.Where(p => p.IsPaid == isPaid.Value);
            }

            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(p => p.PaymentDate)
                                   .Skip((page - 1) * size)
                                   .Take(size)
                                   .ToListAsync();

            return (items, totalCount);
        }

        public async Task DeleteAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment != null)
            {
                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();
            }
        }
    }
}
