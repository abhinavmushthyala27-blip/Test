using RamSoft.Application.Common;

namespace RamSoft.Api.Models;

public class ApiResponse
{
    public ApiResponse(string code, string message, IReadOnlyDictionary<string, string[]>? errors = null)
    {
        Code = code;
        Message = message;
        Errors = errors;
    }

    public string Code { get; }
    public string Message { get; }
    public IReadOnlyDictionary<string, string[]>? Errors { get; }

    public static ApiResponse FromError(Error error)
    {
        var errors = error is ValidationError validationError ? validationError.Errors : null;

        return new ApiResponse(error.Code, error.Message, errors);
    }
}
