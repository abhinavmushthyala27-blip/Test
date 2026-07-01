namespace RamSoft.Application.Common;

public static class Errors
{
    public static class Task
    {
        public static Error NotFound(Guid id) =>
            new("Task.NotFound", $"Task with id '{id}' was not found.");

        public static Error ValidationFailed(string message) =>
            new("Task.ValidationFailed", message);
    }
}
