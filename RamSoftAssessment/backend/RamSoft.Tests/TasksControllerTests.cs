using Microsoft.AspNetCore.Mvc;
using Moq;
using RamSoft.Api.Controllers;
using RamSoft.Api.Models;
using RamSoft.Application.Common;
using RamSoft.Application.DTOs;
using RamSoft.Application.Interfaces;

namespace RamSoft.Tests;

[TestFixture]
public class TasksControllerTests
{
    private Mock<ITaskService> _service = null!;
    private TasksController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        _service = new Mock<ITaskService>();
        _controller = new TasksController(_service.Object);
    }

    [Test]
    public async Task GetById_WhenFound_ReturnsOk()
    {
        var id = Guid.NewGuid();
        _service.Setup(service => service.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(new TaskResponse { Id = id, Name = "Task" }));

        var actionResult = await _controller.GetById(id, CancellationToken.None);

        Assert.That(actionResult, Is.TypeOf<OkObjectResult>());
    }

    [Test]
    public async Task GetById_WhenMissing_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        _service.Setup(service => service.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<TaskResponse>(Errors.Task.NotFound(id)));

        var actionResult = await _controller.GetById(id, CancellationToken.None);

        var notFoundResult = actionResult as NotFoundObjectResult;
        Assert.That(notFoundResult, Is.Not.Null);
        Assert.That(((ApiResponse)notFoundResult!.Value!).Code, Is.EqualTo("Task.NotFound"));
    }

    [Test]
    public async Task Create_WhenValid_ReturnsCreated()
    {
        var id = Guid.NewGuid();
        var request = new CreateTaskRequest { Name = "Task" };
        _service.Setup(service => service.CreateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(new TaskResponse { Id = id, Name = "Task" }));

        var actionResult = await _controller.Create(request, CancellationToken.None);

        Assert.That(actionResult, Is.TypeOf<CreatedAtActionResult>());
    }

    [Test]
    public async Task Create_WhenValidationFails_ReturnsBadRequest()
    {
        var request = new CreateTaskRequest { Name = string.Empty };
        _service.Setup(service => service.CreateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<TaskResponse>(Errors.Task.ValidationFailed("Name is required.")));

        var actionResult = await _controller.Create(request, CancellationToken.None);

        Assert.That(actionResult, Is.TypeOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task Update_WhenValid_ReturnsOk()
    {
        var id = Guid.NewGuid();
        var request = new UpdateTaskRequest { Name = "Updated" };
        _service.Setup(service => service.UpdateAsync(id, request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(new TaskResponse { Id = id, Name = "Updated" }));

        var actionResult = await _controller.Update(id, request, CancellationToken.None);

        Assert.That(actionResult, Is.TypeOf<OkObjectResult>());
    }

    [Test]
    public async Task Delete_WhenSuccessful_ReturnsNoContent()
    {
        var id = Guid.NewGuid();
        _service.Setup(service => service.DeleteAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success());

        var actionResult = await _controller.Delete(id, CancellationToken.None);

        Assert.That(actionResult, Is.TypeOf<NoContentResult>());
    }
}
