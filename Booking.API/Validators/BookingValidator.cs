using FluentValidation;
using BookingModel = Booking.API.Models.Booking;

namespace Booking.API.Validators
{
    public class BookingValidator : AbstractValidator<BookingModel>
    {
        public BookingValidator()
        {
            RuleFor(x => x.CustomerId)
                .GreaterThan(0).WithMessage("Customer ID must be greater than 0");

            RuleFor(x => x.VehicleId)
                .GreaterThan(0).WithMessage("Vehicle ID must be greater than 0");

            RuleFor(x => x.BookingDate)
                .NotEmpty().WithMessage("Booking Date is required")
                .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Booking Date cannot be in the past");

            RuleFor(x => x.ReturnDate)
                .NotEmpty().WithMessage("Return Date is required")
                .GreaterThanOrEqualTo(x => x.BookingDate).WithMessage("Return Date must be on or after Booking Date");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0");

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .Must(status => new[] { "Pending", "Confirmed", "Completed", "Cancelled" }.Contains(status))
                .WithMessage("Status must be one of: Pending, Confirmed, Completed, Cancelled");
        }
    }
}
