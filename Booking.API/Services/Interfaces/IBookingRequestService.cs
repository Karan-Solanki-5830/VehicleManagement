namespace Booking.API.Services.Interfaces
{
    public interface IBookingRequestService
    {
        Task<Booking.API.Models.Booking> CreateBookingRequestAsync(
            Booking.API.Models.Booking booking
        );
    }
}
