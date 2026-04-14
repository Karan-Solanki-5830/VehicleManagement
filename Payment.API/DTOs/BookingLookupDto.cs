namespace Payment.API.DTOs
{
    public class BookingLookupDto
    {
        public int BookingId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public int VehicleId { get; set; }
        public string VehicleNumber { get; set; }
    }
}
