using FluentValidation;
using Moq;
using RamSoft.Application.Common;
using RamSoft.Application.DTOs;
using RamSoft.Application.Interfaces;
using RamSoft.Application.Services;
using RamSoft.Application.Validators;
using RamSoft.Domain.Entities;
using TaskItemStatus = RamSoft.Domain.Enums.TaskStatus;

namespace RamSoft.Tests;

[TestFixture]
public class TaskServiceTests
{
    private Mock<ITaskRepository> _repository = null!;
    private IValidator<CreateTaskRequest> _createValidator = null!;
    private IValidator<UpdateTaskRequest> _updateValidator = null!;
    private TaskService _service = null!;

    [SetUp]
    public void SetUp()
    {
        _repository = new Mock<ITaskRepository>();
        _createValidator = new CreateTaskRequestValidator();
        _updateValidator = new UpdateTaskRequestValidator();
        _service = new TaskService(_repository.Object, _createValidator, _updateValidator);
    }

    [Test]
    public async Task CreateAsync_WhenNameIsEmpty_ReturnsValidationFailure()
    {
        var request = new CreateTaskRequest { Name = string.Empty };

        var result = await _service.CreateAsync(request);

        Assert.That(result.IsFailure, Is.True);
        Assert.That(result.Error.Code, Is.EqualTo("Task.ValidationFailed"));
        Assert.That(((ValidationError)result.Error).Errors[nameof(CreateTaskRequest.Name)], Is.Not.Empty);
        _repository.Verify(repository => repository.AddAsync(It.IsAny<TaskItem>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task CreateAsync_WhenDeadlineIsOlderThanToday_ReturnsValidationFailure()
    {
        var request = new CreateTaskRequest
        {
            Name = "Past deadline",
            Deadline = DateTime.UtcNow.Date.AddDays(-1)
        };

        var result = await _service.CreateAsync(request);

        Assert.That(result.IsFailure, Is.True);
        Assert.That(result.Error.Code, Is.EqualTo("Task.ValidationFailed"));
        Assert.That(((ValidationError)result.Error).Errors[nameof(CreateTaskRequest.Deadline)], Does.Contain("Deadline must not be older than today."));
        _repository.Verify(repository => repository.AddAsync(It.IsAny<TaskItem>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task CreateAsync_WhenValid_AddsTask()
    {
        var request = new CreateTaskRequest
        {
            Name = "New task",
            Description = "Description",
            Status = TaskItemStatus.InProgress,
            IsFavorite = true,
            ImageUrl = "https://example.com/task.png"
        };

        var result = await _service.CreateAsync(request);

        Assert.That(result.IsSuccess, Is.True);
        Assert.That(result.Value!.Name, Is.EqualTo("New task"));
        _repository.Verify(repository => repository.AddAsync(
            It.Is<TaskItem>(task => task.Name == "New task" && task.Status == TaskItemStatus.InProgress && task.IsFavorite),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task GetByIdAsync_WhenTaskDoesNotExist_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        _repository.Setup(repository => repository.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskItem?)null);

        var result = await _service.GetByIdAsync(id);

        Assert.That(result.IsFailure, Is.True);
        Assert.That(result.Error.Code, Is.EqualTo("Task.NotFound"));
    }

    [Test]
    public async Task UpdateAsync_WhenTaskExists_EditsTask()
    {
        var id = Guid.NewGuid();
        var taskItem = new TaskItem
        {
            Id = id,
            Name = "Old name",
            CreatedAtUtc = DateTime.UtcNow
        };
        _repository.Setup(repository => repository.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(taskItem);

        var request = new UpdateTaskRequest
        {
            Name = "Updated name",
            Description = "Updated description",
            Status = TaskItemStatus.Done,
            IsFavorite = true
        };

        var result = await _service.UpdateAsync(id, request);

        Assert.That(result.IsSuccess, Is.True);
        Assert.That(taskItem.Name, Is.EqualTo("Updated name"));
        Assert.That(taskItem.Status, Is.EqualTo(TaskItemStatus.Done));
        Assert.That(taskItem.IsFavorite, Is.True);
        Assert.That(taskItem.UpdatedAtUtc, Is.Not.Null);
        _repository.Verify(repository => repository.UpdateAsync(taskItem, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task UpdateAsync_WhenImageUrlIsInvalid_ReturnsValidationFailure()
    {
        var request = new UpdateTaskRequest
        {
            Name = "Updated name",
            ImageUrl = "not-a-url"
        };

        var result = await _service.UpdateAsync(Guid.NewGuid(), request);

        Assert.That(result.IsFailure, Is.True);
        Assert.That(result.Error.Code, Is.EqualTo("Task.ValidationFailed"));
        Assert.That(((ValidationError)result.Error).Errors[nameof(UpdateTaskRequest.ImageUrl)], Does.Contain("ImageUrl must be a valid URL."));
        _repository.Verify(repository => repository.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task DeleteAsync_WhenTaskExists_RemovesTask()
    {
        var id = Guid.NewGuid();
        var taskItem = new TaskItem { Id = id, Name = "Delete me", CreatedAtUtc = DateTime.UtcNow };
        _repository.Setup(repository => repository.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(taskItem);

        var result = await _service.DeleteAsync(id);

        Assert.That(result.IsSuccess, Is.True);
        _repository.Verify(repository => repository.DeleteAsync(taskItem, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task GetAllAsync_SortsFavoritesFirstThenAlphabetically()
    {
        var tasks = new List<TaskItem>
        {
            new() { Id = Guid.NewGuid(), Name = "Beta", IsFavorite = false, CreatedAtUtc = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Name = "Charlie", IsFavorite = true, CreatedAtUtc = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Name = "Alpha", IsFavorite = true, CreatedAtUtc = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Name = "Alpha", IsFavorite = false, CreatedAtUtc = DateTime.UtcNow }
        };
        _repository.Setup(repository => repository.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(tasks);

        var result = await _service.GetAllAsync();

        Assert.That(result.IsSuccess, Is.True);
        Assert.That(result.Value!.Select(task => task.Name), Is.EqualTo(new[] { "Alpha", "Charlie", "Alpha", "Beta" }));
        Assert.That(result.Value!.Take(2).All(task => task.IsFavorite), Is.True);
    }
}
