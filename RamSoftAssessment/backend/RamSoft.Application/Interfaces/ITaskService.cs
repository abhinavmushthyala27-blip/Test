using RamSoft.Application.Common;
using RamSoft.Application.DTOs;

namespace RamSoft.Application.Interfaces;

public interface ITaskService
{
    Task<Result<IReadOnlyList<TaskResponse>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<TaskResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<TaskResponse>> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task<Result<TaskResponse>> UpdateAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
