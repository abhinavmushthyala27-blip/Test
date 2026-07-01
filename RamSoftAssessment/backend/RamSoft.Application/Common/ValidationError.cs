namespace RamSoft.Application.Common;

public sealed class ValidationError : Error
{
    public ValidationError(string message, IReadOnlyDictionary<string, string[]> errors)
        : base("Task.ValidationFailed", message)
    {
        Errors = errors;
    }

    public IReadOnlyDictionary<string, string[]> Errors { get; }
}
