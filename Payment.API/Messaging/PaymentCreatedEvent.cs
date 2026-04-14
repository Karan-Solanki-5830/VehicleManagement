namespace Payment.API.Messaging
{
    public class PaymentCreatedEvent
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}
