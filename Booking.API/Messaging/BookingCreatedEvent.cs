namespace Booking.API.Messaging
{
    public class BookingCreatedEvent
    {
        public int BookingId { get; set; }
        public int VehicleId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
