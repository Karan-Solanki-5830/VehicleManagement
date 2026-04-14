namespace Booking.API.Services
{
    public interface IEmailService
    {
        void SendBookingConfirmation(int bookingId);
        void SendReturnReminder(int bookingId);
    }

    public class EmailService : IEmailService
    {
        public void SendBookingConfirmation(int bookingId)
        {
            // Simulate a slow process
            Console.WriteLine($"[Hangfire] Starting to send CONFIRMATION email for Booking #{bookingId}...");
            Thread.Sleep(5000); 
            Console.WriteLine($"[Hangfire] CONFIRMATION email SENT for Booking #{bookingId}.");
        }

        public void SendReturnReminder(int bookingId)
        {
            Console.WriteLine($"[Hangfire] [REMINDER] Hey! Don't forget to return vehicle for Booking #{bookingId} soon!");
        }
    }
}
