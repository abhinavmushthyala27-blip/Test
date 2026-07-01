# RamSoft Task Management Assessment

A full-stack task management assessment built with a .NET 8 Clean Architecture backend and a React Vite frontend. The application provides a task board with Todo, In Progress, and Done columns, CRUD operations, favorites, sorting, validation, API error handling, and automated tests.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Application Architecture](#application-architecture)
- [Prerequisites](#prerequisites)
- [Clone the Repository](#clone-the-repository)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [Database and Data Storage](#database-and-data-storage)
- [Design Decisions](#design-decisions)
- [Future Image Upload Design](#future-image-upload-design)
- [Folder Structure](#folder-structure)

## Project Overview

The system is split into two applications:

- `backend` - ASP.NET Core Web API using Clean Architecture.
- `frontend/task-board` - React Vite task board UI.

Users can create, edit, delete, favorite, view, and move tasks between columns. Tasks are sorted with favorites first, then by name ascending.

## Tech Stack

Backend:

- .NET 8
- ASP.NET Core Web API
- EF Core InMemory
- FluentValidation
- Result pattern
- Repository pattern
- Global exception handling middleware
- Swagger/OpenAPI
- NUnit and Moq

Frontend:

- React
- Vite
- Yarn
- React hooks
- React Router
- Material UI
- Axios
- Jest
- React Testing Library

## Features

Completed:

- Add task
- Edit task
- Delete task
- Get task by id
- Get all tasks
- Board columns: Todo, In Progress, Done
- Move tasks between columns by changing status
- Favorite/unfavorite task
- Sort favorites first, then name ascending
- Task details page at `/tasks/:id`
- Loading and error states
- Request validation with FluentValidation
- Result-based service responses
- Global exception handling
- Backend unit tests
- Frontend component tests

Intentionally skipped:

- Image upload. The model keeps an optional `ImageUrl` field only.
- Drag and drop. Tasks are moved with a status dropdown to keep the implementation focused, accessible, and easy to test.

## Application Architecture

The backend follows Clean Architecture principles. Dependencies point inward, with the domain model at the center.

Backend layers:

- `RamSoft.Domain`
  - Contains core business objects.
  - Includes `TaskItem` and `TaskStatus`.

- `RamSoft.Application`
  - Contains use-case logic and application contracts.
  - Includes DTOs, validators, interfaces, services, and the Result pattern.
  - Does not depend on EF Core or ASP.NET Core.

- `RamSoft.Infrastructure`
  - Contains persistence implementation.
  - Includes `TaskDbContext` and `TaskRepository`.
  - Uses EF Core InMemory for this assessment.

- `RamSoft.Api`
  - Contains HTTP concerns.
  - Includes controllers, dependency injection, CORS, Swagger, and global exception middleware.
  - Converts application `Result` objects into HTTP responses.

- `RamSoft.Tests`
  - Contains NUnit and Moq tests for service behavior, controller response mapping, and middleware behavior.

Frontend structure:

- `api`
  - Axios API client for backend communication.

- `constants`
  - Shared task status values and labels.

- `hooks`
  - `useTasks` handles loading, sorting, create, update, and delete behavior.

- `components`
  - Reusable UI pieces such as task board, columns, cards, dialogs, and confirmation modal.

- `pages`
  - Route-level pages for board and task details.

- `tests`
  - Jest and React Testing Library tests.

## Prerequisites

Install the following:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js LTS](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

Verify installation:

```bash
dotnet --version
node --version
yarn --version
```

## Clone the Repository

```bash
git clone https://github.com/abhinavmushthyala27-blip/Test.git
cd RamSoftAssessment
```

## Backend Setup

Restore backend dependencies:

```bash
dotnet restore
```

Run the API:

```bash
dotnet run --project backend/RamSoft.Api/RamSoft.Api.csproj --launch-profile http
```

Default local API URL:

```text
http://localhost:5143
```

Swagger:

```text
http://localhost:5143/swagger
```

## Frontend Setup

Install frontend dependencies:

```bash
cd frontend/task-board
yarn install
```

Run the frontend:

```bash
yarn dev
```

Default frontend URL:

```text
http://localhost:5173
```

The frontend API client defaults to:

```text
http://localhost:5143/api
```

## Running Tests

Backend tests:

```bash
cd RamSoftAssessment
dotnet test
```

Frontend tests:

```bash
cd RamSoftAssessment/frontend/task-board
yarn test
```

## API Endpoints

Base route:

```text
/api/tasks
```

Endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by id |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

HTTP status codes:

| Status Code | Usage |
| --- | --- |
| 200 | Successful get or update |
| 201 | Successful create |
| 204 | Successful delete |
| 400 | Validation failure |
| 404 | Task not found |
| 500 | Unexpected server error |

## Database and Data Storage

This assessment uses EF Core InMemory:

```csharp
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseInMemoryDatabase("RamSoftTasks"));
```

Data is stored in memory inside the running API process. It is not persisted to disk. When the backend restarts, the data resets and the seeded sample tasks are recreated.

This keeps the assessment simple to run without requiring SQL Server, PostgreSQL, Docker, or migrations. In production, EF Core InMemory should be replaced with a persistent database such as Azure SQL, SQL Server, or PostgreSQL.

## Design Decisions

- Clean Architecture keeps domain, application logic, infrastructure, and API concerns separated.
- The Result pattern is used for expected business outcomes such as validation failures and missing tasks.
- Exceptions are reserved for unexpected failures and are handled by `GlobalExceptionMiddleware`.
- FluentValidation is used in the application layer so validation is not tied directly to controllers.
- The repository pattern abstracts persistence from application services.
- EF Core InMemory reduces setup friction for the assessment.
- React hooks keep frontend state and API behavior simple and testable.
- Material UI provides a clean, professional UI without custom design-system overhead.
- A status dropdown was used instead of drag and drop for predictable keyboard/mouse behavior and simpler tests.

## Future Image Upload Design

Image upload was intentionally skipped for this assessment, but the domain keeps an optional `ImageUrl` field.

In production, image upload should be implemented with Azure Blob Storage:

- Use a private Azure Blob Storage container.
- Validate file extension, MIME type, file size, and file signature.
- Request a short-lived upload SAS URL from the backend.
- Upload the file directly from the browser to Azure Blob Storage.
- Store only metadata in the database, such as blob name, content type, file size, and blob URL/path.
- Use short-lived read SAS URLs or a secured backend endpoint for viewing images.
- Optionally scan uploaded files before making them available.

This approach keeps the API lightweight, avoids large request bodies, protects the storage account, and prevents public access to uploaded files.

## Folder Structure

```text
RamSoftAssessment
|-- backend
|   |-- RamSoft.Api
|   |-- RamSoft.Application
|   |-- RamSoft.Domain
|   |-- RamSoft.Infrastructure
|   `-- RamSoft.Tests
`-- frontend
    `-- task-board
        |-- src
        |   |-- api
        |   |-- components
        |   |-- constants
        |   |-- hooks
        |   |-- pages
        |   `-- tests
        |-- package.json
        `-- vite.config.js
```
