using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using RamSoft.Api.Middleware;

namespace RamSoft.Tests;

[TestFixture]
public class GlobalExceptionMiddlewareTests
{
    [Test]
    public async Task InvokeAsync_WhenUnhandledExceptionOccurs_ReturnsGeneric500Response()
    {
        var context = new DefaultHttpContext
        {
            TraceIdentifier = "trace-123"
        };
        context.Response.Body = new MemoryStream();

        RequestDelegate next = _ => throw new InvalidOperationException("Sensitive details");
        var logger = new Mock<ILogger<GlobalExceptionMiddleware>>();
        var middleware = new GlobalExceptionMiddleware(next, logger.Object);

        await middleware.InvokeAsync(context);

        context.Response.Body.Position = 0;
        using var document = await JsonDocument.ParseAsync(context.Response.Body);
        var root = document.RootElement;

        Assert.That(context.Response.StatusCode, Is.EqualTo(StatusCodes.Status500InternalServerError));
        Assert.That(context.Response.ContentType, Is.EqualTo("application/json"));
        Assert.That(root.GetProperty("statusCode").GetInt32(), Is.EqualTo(500));
        Assert.That(root.GetProperty("message").GetString(), Is.EqualTo("An unexpected error occurred."));
        Assert.That(root.GetProperty("traceId").GetString(), Is.EqualTo("trace-123"));
        Assert.That(root.ToString(), Does.Not.Contain("Sensitive details"));
        VerifyLogError(logger);
    }

    private static void VerifyLogError(Mock<ILogger<GlobalExceptionMiddleware>> logger)
    {
        logger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((_, _) => true),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
