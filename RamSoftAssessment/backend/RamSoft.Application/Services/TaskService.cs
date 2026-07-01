using FluentValidation;
using FluentValidation.Results;
using RamSoft.Application.Common;
using RamSoft.Application.DTOs;
using RamSoft.Application.Interfaces;
using RamSoft.Domain.Entities;

namespace RamSoft.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IValidator<CreateTaskRequest> _createValidator;
    private readonly IValidator<UpdateTaskRequest> _updateValidator;

    public TaskService(
        ITaskRepository taskRepository,
        IValidator<CreateTaskRequest> createValidator,
        IValidator<UpdateTaskRequest> updateValidator)
    {
        _taskRepository = taskRepository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<Result<IReadOnlyList<TaskResponse>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var tasks = await _taskRepository.GetAllAsync(cancellationToken);
        var sortedTasks = tasks
            .OrderByDescending(task => task.IsFavorite)
            .ThenBy(task => task.Name, StringComparer.OrdinalIgnoreCase)
            .Select(MapToResponse)
            .ToList();

        return Result.Success<IReadOnlyList<TaskResponse>>(sortedTasks);
    }

    public async Task<Result<TaskResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var taskItem = await _taskRepository.GetByIdAsync(id, cancellationToken);

        return taskItem is null
            ? Result.Failure<TaskResponse>(Errors.Task.NotFound(id))
            : Result.Success(MapToResponse(taskItem));
    }

    public async Task<Result<TaskResponse>> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result.Failure<TaskResponse>(ToValidationError(validationResult));
        }

        var now = DateTime.UtcNow;
        var taskItem = new TaskItem
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = request.Description,
            Deadline = request.Deadline,
            Status = request.Status,
            IsFavorite = request.IsFavorite,
            ImageUrl = request.ImageUrl,
            CreatedAtUtc = now
        };

        await _taskRepository.AddAsync(taskItem, cancellationToken);

        return Result.Success(MapToResponse(taskItem));
    }

    public async Task<Result<TaskResponse>> UpdateAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result.Failure<TaskResponse>(ToValidationError(validationResult));
        }

        var taskItem = await _taskRepository.GetByIdAsync(id, cancellationToken);
        if (taskItem is null)
        {
            return Result.Failure<TaskResponse>(Errors.Task.NotFound(id));
        }

        taskItem.Name = request.Name.Trim();
        taskItem.Description = request.Description;
        taskItem.Deadline = request.Deadline;
        taskItem.Status = request.Status;
        taskItem.IsFavorite = request.IsFavorite;
        taskItem.ImageUrl = request.ImageUrl;
        taskItem.UpdatedAtUtc = DateTime.UtcNow;

        await _taskRepository.UpdateAsync(taskItem, cancellationToken);

        return Result.Success(MapToResponse(taskItem));
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var taskItem = await _taskRepository.GetByIdAsync(id, cancellationToken);
        if (taskItem is null)
        {
            return Result.Failure(Errors.Task.NotFound(id));
        }

        await _taskRepository.DeleteAsync(taskItem, cancellationToken);

        return Result.Success();
    }

    private static TaskResponse MapToResponse(TaskItem taskItem) =>
        new()
        {
            Id = taskItem.Id,
            Name = taskItem.Name,
            Description = taskItem.Description,
            Deadline = taskItem.Deadline,
            Status = taskItem.Status,
            IsFavorite = taskItem.IsFavorite,
            ImageUrl = taskItem.ImageUrl,
            CreatedAtUtc = taskItem.CreatedAtUtc,
            UpdatedAtUtc = taskItem.UpdatedAtUtc
        };

    private static ValidationError ToValidationError(ValidationResult validationResult)
    {
        var errors = validationResult.Errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.ErrorMessage).ToArray());

        return new ValidationError("One or more validation errors occurred.", errors);
    }
}
