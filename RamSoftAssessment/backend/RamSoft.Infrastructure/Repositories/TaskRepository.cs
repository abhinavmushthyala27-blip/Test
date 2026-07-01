using Microsoft.EntityFrameworkCore;
using RamSoft.Application.Interfaces;
using RamSoft.Domain.Entities;
using RamSoft.Infrastructure.Persistence;

namespace RamSoft.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly TaskDbContext _dbContext;

    public TaskRepository(TaskDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _dbContext.Tasks.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _dbContext.Tasks.FindAsync([id], cancellationToken);

    public async Task AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        await _dbContext.Tasks.AddAsync(taskItem, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        _dbContext.Tasks.Update(taskItem);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        _dbContext.Tasks.Remove(taskItem);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
