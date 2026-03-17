# StatusPulse App

Self-hosted service status page and uptime monitor. Built for a live demo at the Hard & Soft Skills meetup (March 17, 2026).

## What it does

- **Public status page** (`/`) - service statuses, uptime graphs, incident history. No auth required.
- **Admin dashboard** (`/admin`) - manage services, incidents, health checks. JWT auth.
- **Background health checker** - pings service URLs every 1-3 minutes, auto-creates incidents on failure, auto-resolves on recovery.

## Tech Stack

- **Backend:** Python, FastAPI, SQLModel, PostgreSQL, Alembic
- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4, shadcn/ui
- **Infrastructure:** Docker Compose, Traefik

Based on [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template).
Presentation: [Live demo:агент для разработки за 40 мин и презентация курса](https://miro.com/app/board/uXjVGxb2Jm8=/)
## Quick Start

```bash
# Clone and configure
cp .env.example .env  # Edit with your values

# Run with Docker
docker compose watch

# Or run locally
# Backend
cd backend && uv sync && fastapi dev app/main.py

# Frontend
bun install && bun run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

## Project Structure

```
backend/
  app/
    api/routes/     # services, incidents, public status page
    health_checker.py  # background URL pinger
    models.py       # Service, HealthCheck, Incident
frontend/
  src/
    components/
      Services/     # CRUD for monitored services
      Incidents/    # Incident management
      StatusPage/   # Public status page components
    routes/         # TanStack Router file-based routing
```

## License

MIT
