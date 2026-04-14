using FluentValidation;
using PaymentModel = Payment.API.Models.Payment;

namespace Payment.API.Validators
{
    public class PaymentValidator : AbstractValidator<PaymentModel>
    {
        public PaymentValidator()
        {
            RuleFor(x => x.BookingId)
                .GreaterThan(0).WithMessage("Booking ID must be greater than 0");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than 0");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty().WithMessage("Payment Method is required")
                .Must(method => new[] { "Credit Card", "Debit Card", "PayPal", "Cash" }.Contains(method))
                .WithMessage("Payment Method must be one of: Credit Card, Debit Card, PayPal, Cash");

            RuleFor(x => x.PaymentDate)
                .NotEmpty().WithMessage("Payment Date is required")
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Payment Date cannot be in the future");
        }
    }
}
