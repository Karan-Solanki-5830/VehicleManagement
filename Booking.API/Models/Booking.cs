namespace Booking.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int VehicleId { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; } = "Pending";

    }
}