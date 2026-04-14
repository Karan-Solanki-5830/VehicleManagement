using Customer.API.Models;
using Customer.API.Repositories.Interfaces;
using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;

namespace Customer.API.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly DataContext _context;

        public CustomerRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<CustomerModel> Items, int TotalCount)> GetAllAsync(int page, int size, string? search = null, string? role = null)
        {
            using var connection = _context.CreateConnection();
            var sMatch = string.IsNullOrWhiteSpace(search) ? null : $"%{search}%";

            var sql = $@"
                SELECT * FROM Customers 
                WHERE (@Search IS NULL OR Name LIKE @S OR Email LIKE @S OR Phone LIKE @S OR CAST(Id as VARCHAR) = @Search)
                AND (@Role IS NULL OR Role = @Role)
                ORDER BY Id OFFSET @Offset ROWS FETCH NEXT @Size ROWS ONLY;
                
                SELECT COUNT(*) FROM Customers 
                WHERE (@Search IS NULL OR Name LIKE @S OR Email LIKE @S OR Phone LIKE @S OR CAST(Id as VARCHAR) = @Search)
                AND (@Role IS NULL OR Role = @Role);";

            var parameters = new { 
                Offset = (page - 1) * size, 
                Size = size, 
                Search = search, 
                S = sMatch, 
                Role = string.IsNullOrWhiteSpace(role) ? null : role 
            };

            using var multi = await connection.QueryMultipleAsync(sql, parameters);
            var items = await multi.ReadAsync<CustomerModel>();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<CustomerModel?> GetByIdAsync(int id)
        {
            using var connection = _context.CreateConnection();

            const string sql = "SELECT Id, Name, Email, Phone, Address, Password, Role, ImageUrl FROM Customers WHERE Id = @Id";

            return await connection.QuerySingleOrDefaultAsync<CustomerModel>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(CustomerModel customer)
        {
            using var connection = _context.CreateConnection();

            const string sql = @"
                INSERT INTO Customers (Name, Email, Phone, Address, Password, Role, ImageUrl)
                VALUES (@Name, @Email, @Phone, @Address, @Password, @Role, @ImageUrl);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            return await connection.QuerySingleAsync<int>(
                sql,
                new
                {
                    customer.Name,
                    customer.Email,
                    customer.Phone,
                    customer.Address,
                    customer.Password,
                    customer.Role,
                    customer.ImageUrl
                }
            );
        }

        public async Task<bool> UpdateAsync(CustomerModel customer)
        {
            using var connection = _context.CreateConnection();

            const string sql = @"
                UPDATE Customers 
                SET Name = @Name, 
                    Email = @Email, 
                    Phone = @Phone, 
                    Address = @Address,
                    Password = @Password,
                    Role = @Role,
                    ImageUrl = @ImageUrl
                WHERE Id = @Id";

            int rows = await connection.ExecuteAsync(
                sql,
                new
                {
                    customer.Id,
                    customer.Name,
                    customer.Email,
                    customer.Phone,
                    customer.Address,
                    customer.Password,
                    customer.Role,
                    customer.ImageUrl
                }
            );

            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.CreateConnection();

            const string sql = "DELETE FROM Customers WHERE Id = @Id";

            int rows = await connection.ExecuteAsync(sql, new { Id = id });

            return rows > 0;
        }

        public async Task<List<CustomerModel>> BulkInsertAsync(List<CustomerModel> customers)
        {
            using var connection = _context.CreateConnection();
            
            const string sql = @"
                INSERT INTO Customers (Name, Email, Phone, Address, Password, Role, ImageUrl)
                VALUES (@Name, @Email, @Phone, @Address, @Password, @Role, @ImageUrl);
                SELECT CAST(SCOPE_IDENTITY() as int);";
            var insertedCustomers = new List<CustomerModel>();
            
            // Using a simple loop with Dapper for reliability. 
            // For better performance with very large datasets, a Transaction or SqlBulkCopy could be used.
            foreach (var customer in customers)
            {
                var id = await connection.QuerySingleAsync<int>(sql, new 
                {
                    customer.Name,
                    customer.Email,
                    customer.Phone,
                    customer.Address,
                    Password = customer.Password ?? string.Empty,
                    Role = string.IsNullOrEmpty(customer.Role) ? "User" : customer.Role,
                    ImageUrl = customer.ImageUrl
                });
                
                customer.Id = id;
                insertedCustomers.Add(customer);
            }

            return insertedCustomers;
        }

        public async Task<CustomerModel?> GetByNameAsync(string name)
        {
            using var connection = _context.CreateConnection();
            const string sql = "SELECT Id, Name, Email, Phone, Address, Password, Role, ImageUrl FROM Customers WHERE Name = @Name";
            return await connection.QueryFirstOrDefaultAsync<CustomerModel>(sql, new { Name = name });
        }
    }
}
