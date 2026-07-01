using TaskItemStatus = RamSoft.Domain.Enums.TaskStatus;

namespace RamSoft.Application.DTOs;

public class CreateTaskRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public bool IsFavorite { get; set; }
    public string? ImageUrl { get; set; }
}
