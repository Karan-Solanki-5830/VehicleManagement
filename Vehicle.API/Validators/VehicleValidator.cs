using FluentValidation;
using VehicleModel = Vehicle.API.Models.Vehicle;

namespace Vehicle.API.Validators
{
    public class VehicleValidator : AbstractValidator<VehicleModel>
    {
        public VehicleValidator()
        {
            RuleFor(x => x.VehicleNumber)
                .NotEmpty().WithMessage("Vehicle Number is required")
                .MaximumLength(50).WithMessage("Vehicle Number must not exceed 50 characters");

            RuleFor(x => x.Model)
                .NotEmpty().WithMessage("Model is required")
                .MaximumLength(100).WithMessage("Model must not exceed 100 characters");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Type is required")
                .MaximumLength(50).WithMessage("Type must not exceed 50 characters");

            RuleFor(x => x.Capacity)
                .GreaterThan(0).WithMessage("Capacity must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Capacity must not exceed 100");

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .Must(status => new[] { "Available", "Maintenance", "Disabled" }.Contains(status))
                .WithMessage("Status must be one of: Available, Maintenance, Disabled");
        }
    }
}
