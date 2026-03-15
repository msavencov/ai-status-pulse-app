# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack web app based on the FastAPI template. Python/FastAPI backend + React/TypeScript frontend. Monorepo managed with Bun (frontend) and uv (backend).

## Commands

### Full Stack (Docker)

```bash
docker compose watch              # Start all services with hot reload
docker compose up -d --wait       # Start stack (detached)
docker compose stop frontend      # Stop one service to run locally instead
docker compose down -v            # Stop and remove volumes
```

### Frontend

```bash
bun run dev                       # Vite dev server at http://localhost:5173
bun run build                     # TypeScript check + Vite production build
bun run lint                      # Biome linter
bun run generate-client           # Regenerate OpenAPI client from backend schema
bunx playwright test              # Run E2E tests
bunx playwright test --ui         # Playwright UI mode
bunx playwright test tests/foo.spec.ts  # Run single test file
```

### Backend

```bash
cd backend
uv sync                           # Install Python dependencies
fastapi dev app/main.py           # Dev server at http://localhost:8000
pytest                            # Run all tests
pytest tests/api/routes/test_items.py  # Run single test file
pytest -x                         # Stop on first failure
alembic revision --autogenerate -m "description"  # Create migration
alembic upgrade head              # Apply migrations
```

### Pre-commit Hooks (prek)

```bash
cd backend && uv run prek install -f   # Install hooks
uv run prek run --all-files            # Run manually on all files
```

Linters: ruff (Python), biome (frontend). Both run via prek on commit.

## Architecture

### Frontend (`frontend/`)

- **React 19** + TypeScript + **Vite 7**
- **TanStack Router** - file-based routing in `src/routes/`. Route tree auto-generated in `routeTree.gen.ts`
- **TanStack Query** - data fetching/caching. Query keys: `["currentUser"]`, `["users"]`, `["items"]`
- **shadcn/ui** + Radix UI + **Tailwind CSS 4** - component library in `src/components/ui/`
- **Auto-generated API client** (`src/client/`) - generated from backend OpenAPI schema via `@hey-api/openapi-ts` with Axios. Regenerate with `bun run generate-client`
- Path alias: `@` maps to `src/`

**Key patterns:**
- `src/routes/_layout.tsx` - protected layout requiring auth, renders sidebar
- `src/hooks/useAuth.ts` - auth management (login/signup/logout), JWT stored in localStorage
- `src/components/Common/ActionsMenu.tsx` - reusable actions pattern across Admin/Items
- Forms use React Hook Form + Zod validation

### Backend (`backend/`)

- **FastAPI** with **SQLModel** ORM (SQLAlchemy + Pydantic)
- **PostgreSQL** database, **Alembic** migrations in `app/alembic/`
- API routes at `app/api/routes/` (login, users, items, utils, private)
- Dependencies/DI in `app/api/deps.py` (`SessionDep`, `CurrentUser`)
- Config via Pydantic Settings in `app/core/config.py`
- JWT auth in `app/core/security.py`

**API base path:** `/api/v1`

### Infrastructure

- **Docker Compose**: `compose.yml` (prod) + `compose.override.yml` (dev overrides with volume mounts)
- **Traefik** reverse proxy - subdomain routing in production (`api.domain`, `dashboard.domain`)
- Services run on same ports locally whether Docker or native: backend `:8000`, frontend `:5173`
- **Mailcatcher** at `:1080` for dev email testing

## Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| Adminer (DB) | http://localhost:8080 |
| Traefik | http://localhost:8090 |
| Mailcatcher | http://localhost:1080 |

## Environment

Root `.env` holds shared config (domain, secrets, DB passwords). Frontend `.env` has `VITE_API_URL`. Backend reads config through Pydantic Settings. Critical values to change before deploy: `SECRET_KEY`, `FIRST_SUPERUSER_PASSWORD`, `POSTGRES_PASSWORD`.
