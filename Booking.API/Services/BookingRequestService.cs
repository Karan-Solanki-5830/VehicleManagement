using Booking.API.Messaging;
using Booking.API.Services.Interfaces;

namespace Booking.API.Services
{
    public class BookingRequestService : IBookingRequestService
    {
        private readonly IBookingService _bookingService;
        private readonly RabbitMqPublisher _publisher;

        public BookingRequestService(IBookingService bookingService)
        {
            _bookingService = bookingService;
            _publisher = new RabbitMqPublisher();
        }


        public async Task<Models.Booking> CreateBookingRequestAsync(Models.Booking booking)
        {
            booking.Status = "Pending";

            var createdBooking = await _bookingService.CreateBookingAsync(booking);

            _publisher.PublishBookingCreated(new BookingCreatedEvent
            {
                BookingId = createdBooking.Id,
                VehicleId = createdBooking.VehicleId,
                CreatedAt = DateTime.UtcNow
            });

            return createdBooking;
        }
    }
}
