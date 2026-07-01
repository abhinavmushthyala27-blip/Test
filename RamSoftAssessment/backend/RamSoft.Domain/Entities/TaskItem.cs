using TaskItemStatus = RamSoft.Domain.Enums.TaskStatus;

namespace RamSoft.Domain.Entities;

public class TaskItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public bool IsFavorite { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
}
