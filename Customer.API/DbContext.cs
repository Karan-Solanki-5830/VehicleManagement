namespace Customer.API
{
    using Microsoft.Data.SqlClient;

    public class DataContext
    {
        private readonly string _connectionString;

        public DataContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CustomerDb") ?? throw new InvalidOperationException("Connection string not found");
        }

        public SqlConnection CreateConnection()
            => new SqlConnection(_connectionString);
    }

}
