# Deployment Guide

**Агенты:** devops, developer

---

## Architecture Overview

StatusPulse uses a split deployment: static frontend on Vercel, persistent backend + managed PostgreSQL on Railway.

| Component | Platform | Deploy method |
|-----------|----------|---------------|
| Frontend (React + Vite) | Vercel | Auto-deploy on push to `master` |
| Backend (FastAPI) | Railway | Docker build via `Dockerfile.railway`, manual trigger |
| PostgreSQL | Railway | Managed, connected via reference variables |

**Why split (see ADR-001):**
- Vercel is optimised for static/SPA — CDN, edge, free tier
- Railway supports persistent processes (background health checker) and managed PostgreSQL
- Vercel serverless would break the background health-check task that runs inside FastAPI lifespan

**CORS dependency:** `FRONTEND_HOST` on Railway must exactly match the Vercel deployment URL (with `https://`, no trailing slash).

---

## Local Development (without Docker)

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.10+ | `brew install python@3.10` or pyenv |
| uv | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Node.js | 22+ | `brew install node` or nvm |
| bun | latest | `npm install -g bun` |
| PostgreSQL | 16 | `brew install postgresql@16` |

### Database Setup

```bash
# Start PostgreSQL
brew services start postgresql@16

# Create superuser (matches .env default)
createuser -s postgres

# Create the app database
createdb -U postgres app

# Set the password (must match POSTGRES_PASSWORD in .env)
psql -U postgres -c "ALTER USER postgres PASSWORD 'changethis';"
```

### Backend

```bash
cd backend

# Install Python dependencies (reads pyproject.toml + uv.lock)
uv sync

# Apply database migrations
alembic upgrade head

# Start dev server at http://localhost:8000
fastapi dev app/main.py
```

The `prestart` script runs automatically on first launch, seeding `FIRST_SUPERUSER`.

### Frontend

```bash
cd frontend

# Install dependencies
bun install

# Start Vite dev server at http://localhost:5173
bun run dev
```

### Environment Variables

**Root `.env`** (backend + Docker Compose):

```
DOMAIN=localhost
FRONTEND_HOST=http://localhost:5173
ENVIRONMENT=local
PROJECT_NAME="StatusPulse"
STACK_NAME=status-pulse

# Auth
SECRET_KEY=<generate with: python3 -c "import secrets; print(secrets.token_urlsafe(32))">
FIRST_SUPERUSER=admin@statuspulse.local
FIRST_SUPERUSER_PASSWORD=changethis

# PostgreSQL
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changethis

# Backend CORS
BACKEND_CORS_ORIGINS="http://localhost,http://localhost:5173"

# Optional
SENTRY_DSN=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_EMAIL=info@example.com
```

**`frontend/.env`** (Vite dev server):

```
VITE_API_URL=http://localhost:8000
MAILCATCHER_HOST=http://localhost:1080
```

### Development URLs (native)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

---

## Local Development (Docker)

Docker Compose runs all services together with hot reload. Uses `compose.yml` (base config) merged with `compose.override.yml` (dev overrides: ports, volumes, hot reload, mailcatcher).

### Quick start

```bash
# Start all services with hot reload (recommended for dev)
docker compose watch

# Or: start detached (no logs, wait for healthy)
docker compose up -d --wait

# Stop one service to run it natively instead (e.g. run backend locally)
docker compose stop backend

# Tear down everything including volumes
docker compose down -v
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| `backend` | `:8000` | FastAPI, auto-reloads on code change |
| `frontend` | `:5173` | Nginx serving Vite build (not Vite dev server in Docker) |
| `db` | `:5432` | PostgreSQL 18 |
| `adminer` | `:8080` | Database GUI (pepa-linha-dark theme) |
| `mailcatcher` | `:1080` (web), `:1025` (SMTP) | Dev email catcher |
| `proxy` (Traefik) | `:80`, `:8090` | Reverse proxy + dashboard |

**Note:** In Docker, `backend` reads `POSTGRES_SERVER=db` (service name), not `localhost`.

### Dev overrides (compose.override.yml)

- Backend mounts `./backend` into the container and runs `fastapi run --reload`
- Frontend builds with `VITE_API_URL=http://localhost:8000`
- Traefik runs in insecure mode (no TLS required locally)
- Mailcatcher is used as SMTP (`SMTP_HOST=mailcatcher`, port 1025)

### Docker URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| Adminer (DB GUI) | http://localhost:8080 |
| Traefik Dashboard | http://localhost:8090 |
| Mailcatcher | http://localhost:1080 |

---

## Production: Frontend (Vercel)

### Setup

1. Connect GitHub repo to Vercel project
2. Vercel auto-detects Vite — build command is `bun run build` (runs `tsc -p tsconfig.build.json && vite build`)
3. Output directory: `frontend/dist`
4. Root directory: `frontend`

### Environment Variables on Vercel

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://backend-production-276a.up.railway.app` |

`VITE_API_URL` is baked into the static bundle at build time by Vite — it is not a runtime variable.

### Deploy trigger

Every push to `master` auto-deploys to Vercel. No manual action needed.

### Production URL

`https://status-pulse-app-frontend.vercel.app`

---

## Production: Backend (Railway)

### Docker setup

Railway uses `backend/Dockerfile.railway` (configured in `railway.toml`). This file differs from `backend/Dockerfile` (local):

| | `Dockerfile` (local) | `Dockerfile.railway` (prod) |
|---|---|---|
| Cache mounts | Yes (`--mount=type=cache`) | No — Railway doesn't support BuildKit cache mounts |
| Workers | 4 | 2 |
| Purpose | Docker Compose, local | Railway build |

### railway.toml

```toml
[build]
dockerfilePath = "backend/Dockerfile.railway"

[deploy]
healthcheckPath = "/api/v1/utils/health-check/"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

### Environment Variables on Railway

Set all 12 variables via Railway CLI (MCP has array typing issues — use CLI for batch set):

```bash
railway variables set \
  'PROJECT_NAME=StatusPulse' \
  'ENVIRONMENT=production' \
  'SECRET_KEY=<generate>' \
  'FIRST_SUPERUSER=admin@statuspulse.app' \
  'FIRST_SUPERUSER_PASSWORD=<secure>' \
  'FRONTEND_HOST=https://status-pulse-app-frontend.vercel.app' \
  'BACKEND_CORS_ORIGINS=https://status-pulse-app-frontend.vercel.app' \
  'POSTGRES_SERVER=${{Postgres.PGHOST}}' \
  'POSTGRES_PORT=${{Postgres.PGPORT}}' \
  'POSTGRES_USER=${{Postgres.PGUSER}}' \
  'POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}' \
  'POSTGRES_DB=${{Postgres.PGDATABASE}}'
```

**Rules:**
- Always use Railway reference variables `${{Postgres.PGHOST}}` etc. — never hardcode DB credentials
- Generate `SECRET_KEY` with: `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`
- `FRONTEND_HOST` must exactly match the Vercel URL: `https://`, no trailing slash

### Deploy

```bash
# Via Railway CLI (recommended for first deploy or forced redeploy)
railway up

# Via MCP (for status/monitoring)
# Use mcp__railway__deploy tool
```

### Health check

After every deploy:

```bash
curl https://backend-production-276a.up.railway.app/api/v1/utils/health-check/
# Expected: {"status": true}
```

Monitor logs for 10 minutes after deploy.

### Production URL

`https://backend-production-276a.up.railway.app`

---

## Production: Database (Railway PostgreSQL)

Railway manages the PostgreSQL instance. No manual setup required.

- Service name in Railway: `Postgres`
- Connect from backend using reference variables (see env vars above)
- Migrations run automatically via `scripts/prestart.sh` on backend start

---

## URLs Reference

| Environment | Service | URL |
|-------------|---------|-----|
| Local (native) | Frontend | http://localhost:5173 |
| Local (native) | Backend API | http://localhost:8000 |
| Local (native) | Swagger UI | http://localhost:8000/docs |
| Local (Docker) | Frontend | http://localhost:5173 |
| Local (Docker) | Backend API | http://localhost:8000 |
| Local (Docker) | Adminer | http://localhost:8080 |
| Local (Docker) | Traefik | http://localhost:8090 |
| Local (Docker) | Mailcatcher | http://localhost:1080 |
| Production | Frontend | https://status-pulse-app-frontend.vercel.app |
| Production | Backend API | https://backend-production-276a.up.railway.app |
| Production | Swagger UI | https://backend-production-276a.up.railway.app/docs |
| Production | Health Check | https://backend-production-276a.up.railway.app/api/v1/utils/health-check/ |

---

## Useful Commands

```bash
# --- Backend ---
cd backend && uv sync                            # Install / sync Python deps
cd backend && alembic upgrade head               # Apply DB migrations
cd backend && alembic revision --autogenerate -m "description"  # New migration
cd backend && fastapi dev app/main.py            # Dev server (native)
cd backend && pytest                             # All backend tests
cd backend && pytest -x                          # Stop on first failure

# --- Frontend ---
cd frontend && bun install                       # Install deps
cd frontend && bun run dev                       # Vite dev server (native)
cd frontend && bun run build                     # Production build (TS check + Vite)
cd frontend && bun run lint                      # Biome linter (auto-fix)
cd frontend && bun run generate-client           # Regenerate OpenAPI client from backend schema
cd frontend && bunx playwright test              # E2E tests
cd frontend && bunx playwright test --ui         # E2E tests in UI mode

# --- Docker ---
docker compose watch                             # All services with hot reload
docker compose up -d --wait                      # Start detached, wait for healthy
docker compose stop backend                      # Stop one service (run natively instead)
docker compose down -v                           # Stop + remove volumes

# --- Railway ---
railway status                                   # Current project/environment
railway variables set 'KEY=value'               # Set env var
railway logs                                     # Tail deployment logs
railway up                                       # Deploy current directory

# --- Git (for DevOps agent) ---
git push origin master                           # Triggers Vercel auto-deploy
```

---

## Troubleshooting

### CORS error in browser (frontend can't reach backend)

**Symptom:** `Access-Control-Allow-Origin` error in browser console.

**Cause:** `FRONTEND_HOST` on Railway doesn't match the Vercel URL.

**Fix:** Update `FRONTEND_HOST` and `BACKEND_CORS_ORIGINS` on Railway to the exact Vercel URL:
```
FRONTEND_HOST=https://status-pulse-app-frontend.vercel.app
BACKEND_CORS_ORIGINS=https://status-pulse-app-frontend.vercel.app
```
No trailing slash. Then redeploy backend.

---

### Railway build fails: "unknown flag: --mount"

**Cause:** Using `backend/Dockerfile` (local) instead of `backend/Dockerfile.railway`.

**Fix:** Check `railway.toml` — `dockerfilePath` must be `backend/Dockerfile.railway`. See ADR-002.

---

### Backend health check fails after deploy

**Cause:** DB migrations haven't run, or DB env vars are wrong.

**Fix:**
1. Check Railway logs: `railway logs`
2. Verify all `POSTGRES_*` vars use reference variables `${{Postgres.PGHOST}}` etc.
3. Confirm `prestart.sh` ran successfully (look for "Creating initial data" in logs)

---

### Frontend shows blank page or old data after Vercel deploy

**Cause:** `VITE_API_URL` is baked at build time. If it was empty or wrong, rebuild.

**Fix:** Set `VITE_API_URL` in Vercel project settings, then trigger a new deployment.

---

### `alembic upgrade head` fails locally: "connection refused"

**Cause:** PostgreSQL isn't running locally.

**Fix:**
```bash
brew services start postgresql@16
```

---

### Railway MCP tool errors (array/number typing)

**Cause:** Railway MCP has known issues with array and number parameter types.

**Fix:** Use CLI directly for batch operations (setting variables, etc.). See `docs/help/mcp-vs-cli/railway-mcp-vs-cli.md`.

---

### OpenAPI client is outdated (TypeScript errors on API calls)

**Cause:** Backend schema changed but frontend client wasn't regenerated.

**Fix:** With backend running at `:8000`:
```bash
cd frontend && bun run generate-client
```
