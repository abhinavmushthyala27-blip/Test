using FluentValidation;
using RamSoft.Application.DTOs;

namespace RamSoft.Application.Validators;

public class CreateTaskRequestValidator : AbstractValidator<CreateTaskRequest>
{
    public CreateTaskRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Description)
            .MaximumLength(1000);

        RuleFor(x => x.Deadline)
            .Must(deadline => !deadline.HasValue || deadline.Value.Date >= DateTime.UtcNow.Date)
            .WithMessage("Deadline must not be older than today.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(2048);

        RuleFor(x => x.Status)
            .IsInEnum();
    }
}
