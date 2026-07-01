# RamSoft Task Management Assessment

## Project Overview

RamSoftAssessment is a full-stack task management assessment built with a .NET 8 Clean Architecture backend and a React Vite frontend. The application provides a simple task board with Todo, In Progress, and Done columns, task CRUD operations, favorite handling, and route-based task details.

## Tech Stack

Backend:
- .NET 8 ASP.NET Core Web API
- Clean Architecture
- EF Core InMemory
- FluentValidation
- Result pattern
- Repository pattern
- NUnit and Moq
- Swagger

Frontend:
- React with Vite
- Yarn
- React hooks
- React Router
- Material UI
- Axios
- React Testing Library
- Jest

## Features Completed

- Add, edit, delete, get by id, and get all tasks
- Board with Todo, In Progress, and Done columns
- Move tasks between columns by updating status
- Favorite task toggle
- Sort favorites first, then task name ascending
- Optional `ImageUrl` field
- Loading and error states
- Task details route at `/tasks/:id`
- Global exception middleware
- FluentValidation request validation
- Service and controller tests
- Frontend component tests

## Features Intentionally Skipped

- Image upload is intentionally out of scope. The API keeps an optional `ImageUrl` field only.
- Drag and drop is intentionally skipped. Tasks are moved with a status dropdown for clarity and lower implementation risk.

## Architecture

The backend follows Clean Architecture:

- `RamSoft.Domain` contains core entities and enums.
- `RamSoft.Application` contains DTOs, validation, interfaces, services, and the Result pattern.
- `RamSoft.Infrastructure` contains EF Core persistence and repository implementation.
- `RamSoft.Api` contains controllers, middleware, Swagger, CORS, and dependency injection.
- `RamSoft.Tests` contains NUnit and Moq tests.

Expected business outcomes, such as validation failures and missing tasks, are returned as `Result` or `Result<T>`. Exceptions are reserved for unexpected failures and are handled by global middleware.

The frontend keeps API access, constants, hooks, components, and pages separated. `useTasks` owns task loading and mutations, while Material UI components provide the board, dialogs, and task cards.

## Backend Run Commands

```bash
cd RamSoftAssessment
dotnet restore
dotnet run --project backend/RamSoft.Api/RamSoft.Api.csproj
```

Swagger is available in development at:

```text
https://localhost:<port>/swagger
```

## Frontend Run Commands

Install Node.js first, then:

```bash
cd RamSoftAssessment/frontend/task-board
yarn install
yarn dev
```

The frontend runs on:

```text
http://localhost:5173
```

The frontend API base URL defaults to:

```text
https://localhost:7001/api
```

## Test Commands

Backend:

```bash
cd RamSoftAssessment
dotnet test
```

Frontend:

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

- `GET /api/tasks` - get all tasks
- `GET /api/tasks/{id}` - get task by id
- `POST /api/tasks` - create task
- `PUT /api/tasks/{id}` - update task
- `DELETE /api/tasks/{id}` - delete task

HTTP behavior:

- `200 OK` for successful get and update
- `201 Created` for create
- `204 No Content` for delete
- `400 Bad Request` for validation failures
- `404 Not Found` for missing tasks
- `500 Internal Server Error` for unexpected exceptions

## Design Decisions

- EF Core InMemory keeps the assessment easy to run without a database dependency.
- The Result pattern keeps expected business failures explicit and avoids throwing exceptions for normal validation or not-found cases.
- Validators live in the application layer so validation is reusable outside HTTP controllers.
- The frontend uses a status dropdown instead of drag and drop to keep moving tasks accessible, testable, and simple.
- Favorites are sorted first in both backend service behavior and frontend state updates.
- Image upload is excluded, but `ImageUrl` remains on the task model to show where image metadata would surface.

## Production Image Upload Design

In production, image upload should use Azure Blob Storage rather than sending files through the task API as base64.

Recommended approach:

- Use a private Azure Blob Storage container.
- Validate file type, extension, size, and content signature before accepting an upload.
- Generate short-lived SAS URLs for direct browser uploads.
- Upload the file directly from the frontend to Azure Blob Storage using the SAS URL.
- Store only metadata in the database, such as blob name, content type, size, and the blob URL or storage path.
- Serve images through short-lived read SAS URLs or a backend endpoint that authorizes access before issuing a read URL.
- Scan uploaded files if the production compliance profile requires malware scanning.

This keeps the API lightweight, avoids large request bodies, prevents public container exposure, and preserves control over file access.

## Folder Structure

```text
RamSoftAssessment
 ├─ backend
 │   ├─ RamSoft.Api
 │   ├─ RamSoft.Application
 │   ├─ RamSoft.Domain
 │   ├─ RamSoft.Infrastructure
 │   └─ RamSoft.Tests
 └─ frontend
     └─ task-board
```
