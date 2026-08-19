# NawyTask

NawyTask is a full-stack apartment listing application that allows users to browse apartments, filter by key fields, and view detailed apartment information. The project is structured as a small production-style stack using a TypeScript backend, PostgreSQL, and a Next.js frontend.

## Stack

- Backend: Node.js + TypeScript + Express
- ORM: Prisma
- Database: PostgreSQL
- Frontend: Next.js + React + TypeScript
- State/data fetching: React Query
- Containerization: Docker + Docker Compose
- API docs: Swagger UI via OpenAPI

## Project goals

- Provide a clean backend API for listing apartments, fetching a single apartment, and creating apartments.
- Support versioned routes under `/api/v1`.
- Add simple search/filter behavior on the listing page.
- Use cursor-based pagination for scalable listing responses.
- Keep code organized into layered backend modules and a clean frontend structure.
- Run the entire app with a single Docker Compose command.

## Architecture overview

### Backend

The backend is organized into a layered structure:

- `backend/src/domain`: domain types and repository contracts
- `backend/src/application`: service layer for use cases
- `backend/src/infrastructure`: Prisma implementation and app infrastructure
- `backend/src/interfaces`: controllers, DTO validation, and request boundaries
- `backend/src/middlewares`: centralized error handling

This keeps the domain logic decoupled from Prisma and Express-specific code.

### Frontend

The frontend uses the Next.js App Router and a typed API client. The listing and detail views consume the backend through a small Axios client and React Query hooks.

## Prerequisites

Before starting the project, make sure you have:

- Docker
- Docker Compose
- Node.js 20+ (for local dev outside Docker)
- npm

## Environment variables

The repo uses environment variables for runtime configuration and keeps secrets out of source control.

Before you start the project, create the required local env files. The app will not run without them.

### Root (used by docker-compose)

```bash
cp .env.example .env
```

`docker-compose.yml` reads this file to fill in `${POSTGRES_USER}`, `${DATABASE_URL}`, `${NEXT_PUBLIC_API_URL}`, etc. `NEXT_PUBLIC_API_URL` in particular is baked into the frontend's client bundle at *build* time (passed through as a Docker build arg), so it must be set before running `docker compose up --build`.

### Backend

```bash
cp backend/.env.example backend/.env
```

Example backend values:

```env
POSTGRES_USER=postgres
POSTGRES_DB=nawydb
POSTGRES_PASSWORD=strong_local_password
DATABASE_URL=postgres://postgres:strong_local_password@db:5432/nawydb
PORT=4000
LOG_LEVEL=info
```

### Frontend

```bash
cp frontend/.env.local.example frontend/.env.local
```

Example frontend value:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

> Do not commit `.env`, `.env.local`, or any real credentials. These files are required locally before starting the repo.

## Running the app with Docker

From the project root:

```bash
docker compose up --build
```

This starts:

- PostgreSQL on port `5432`
- Backend on port `4000`
- Frontend on port `3000`

### Health check

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{ "status": "ok" }
```

## API documentation

Swagger UI is available at:

```text
http://localhost:4000/api/docs
```

The OpenAPI specification is mounted through the Express backend and exposes the `v1` apartment API.

## API endpoints

### 1) Health

```http
GET /health
```

Returns whether the backend is running.

### 2) List apartments

```http
GET /api/v1/apartments
```

Optional query parameters:

- `unitName`: filter by unit name (case-insensitive partial match)
- `unitNumber`: filter by unit number (case-insensitive partial match)
- `project`: filter by project name (case-insensitive partial match)
- `q`: free-text search, OR-matched across `unitName`, `unitNumber` and `project` (this is what the frontend's single search box uses)
- `cursor`: cursor for pagination
- `limit`: number of results to return (default `20`, max `100`)

`unitName` / `unitNumber` / `project` are combined with **AND** when more than one is given, e.g. `unitName=Sky&project=Tower` narrows to apartments named "Sky\*" *within* project "Tower\*". `q` is combined with **AND** against any of those, but OR-matches across the three fields itself, e.g. `q=sky` matches an apartment whose name, unit number, *or* project contains "sky".

Example:

```bash
curl "http://localhost:4000/api/v1/apartments?project=Sky&limit=10"
curl "http://localhost:4000/api/v1/apartments?q=sky&limit=10"
```

Example response:

```json
{
  "items": [
    {
      "id": "abc123",
      "unitName": "Sky View",
      "unitNumber": "101",
      "project": "Sky Tower",
      "price": "1500000.00",
      "bedrooms": 2,
      "bathrooms": 2,
      "areaSqm": 95,
      "description": "Bright apartment with city view",
      "imageUrl": null,
      "createdAt": "2026-08-19T00:00:00.000Z",
      "updatedAt": "2026-08-19T00:00:00.000Z"
    }
  ],
  "nextCursor": "xyz456"
}
```

### 3) Get apartment by id

```http
GET /api/v1/apartments/:id
```

Example:

```bash
curl http://localhost:4000/api/v1/apartments/abc123
```

### 4) Create apartment

```http
POST /api/v1/apartments
```

Request body:

```json
{
  "unitName": "Sky View",
  "unitNumber": "101",
  "project": "Sky Tower",
  "price": "1500000.00",
  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqm": 95,
  "description": "Bright apartment with city view",
  "imageUrl": "https://example.com/image.jpg"
}
```

Example:

```bash
curl -X POST http://localhost:4000/api/v1/apartments \
  -H "Content-Type: application/json" \
  -d '{
    "unitName": "Sky View",
    "unitNumber": "101",
    "project": "Sky Tower",
    "price": "1500000.00",
    "bedrooms": 2,
    "bathrooms": 2,
    "areaSqm": 95,
    "description": "Bright apartment with city view"
  }'
```

## Frontend pages

- Listing page: `http://localhost:3000/apartments`
- Apartment detail page: `http://localhost:3000/apartments/:id`

The listing page supports search/filtering by unit name, unit number, or project and uses cursor-based loading for additional pages.

## Local development without Docker

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Backend tests

```bash
cd backend
npm test
```

### Frontend tests

```bash
cd frontend
npm test
```

## Project structure

```text
NawyTask/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── test/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── next.config.js
├── docker-compose.yml
├── .gitignore
├── README.md
└── .env.example (if added at repo root in future)
```

## Notes

- Prisma is configured to use the PostgreSQL datasource from `DATABASE_URL`.
- The backend container uses a `db` hostname internally, which is the correct Docker service name for the PostgreSQL container.
- The app intentionally keeps env files out of source control.
- This project uses versioned API routes under `/api/v1` for clear forward compatibility.

## Future improvements

- Add stronger validation and pagination metadata responses.
- Expand unit and integration tests for edge cases.
- Add authentication and authorization if the app grows beyond a demo/listing service.
- Add CI/CD configuration and deployment setup.

## Summary

This project demonstrates a clean full-stack implementation for apartment listing with search, versioned API routes, pagination, Prisma-backed persistence, and a responsive Next.js UI. The repository is structured to be easy to understand and extend while still remaining simple enough for local Docker-based development.

