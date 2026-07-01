using Microsoft.EntityFrameworkCore;
using RamSoft.Domain.Entities;
using TaskItemStatus = RamSoft.Domain.Enums.TaskStatus;

namespace RamSoft.Infrastructure.Persistence;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(task => task.Id);
            entity.Property(task => task.Name).IsRequired().HasMaxLength(100);
            entity.Property(task => task.Description).HasMaxLength(1000);
            entity.Property(task => task.ImageUrl).HasMaxLength(2048);
            entity.Property(task => task.Status).HasConversion<string>();
        });

        modelBuilder.Entity<TaskItem>().HasData(
            new TaskItem
            {
                Id = Guid.Parse("4975eafb-e3a9-49a5-b0d8-34e2cab46051"),
                Name = "Plan assessment",
                Description = "Review requirements and define the first task board column.",
                Deadline = DateTime.UtcNow.Date.AddDays(3),
                Status = TaskItemStatus.Todo,
                IsFavorite = true,
                ImageUrl = null,
                CreatedAtUtc = DateTime.UtcNow
            },
            new TaskItem
            {
                Id = Guid.Parse("78a34da4-9797-497d-bc66-a8a21724e7a0"),
                Name = "Build API",
                Description = "Implement task endpoints and service layer.",
                Deadline = DateTime.UtcNow.Date.AddDays(7),
                Status = TaskItemStatus.InProgress,
                IsFavorite = false,
                ImageUrl = null,
                CreatedAtUtc = DateTime.UtcNow
            },
            new TaskItem
            {
                Id = Guid.Parse("c8376c8d-d44f-4f8f-bd37-2c11cbdb4e75"),
                Name = "Write tests",
                Description = "Cover service behavior and controller status mapping.",
                Deadline = null,
                Status = TaskItemStatus.Done,
                IsFavorite = false,
                ImageUrl = null,
                CreatedAtUtc = DateTime.UtcNow
            });
    }
}
