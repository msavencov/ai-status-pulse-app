# DevOps Conventions

**Агенты:** devops

---

## Deployment Architecture

| Компонент | Платформа | Метод деплоя |
|-----------|----------|-------------|
| Frontend | Vercel | Auto-deploy on push (GitHub integration) |
| Backend | Railway | Docker build (`Dockerfile.railway`) |
| PostgreSQL | Railway | Managed, reference variables |

## Environment Variables

### Railway (Backend)

13 переменных. Устанавливать через CLI (MCP ломается на массивах):

```bash
railway variables set \
  'PROJECT_NAME=StatusPulse' \
  'ENVIRONMENT=production' \
  'SECRET_KEY=<generated>' \
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

**Railway reference variables:** всегда использовать `${{Postgres.PGHOST}}` и т.д. для DB credentials. НЕ хардкодить.

**SECRET_KEY:** генерировать через `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`

### Vercel (Frontend)

- `VITE_API_URL` → URL бэкенда на Railway

## CORS

**Критично для связи FE ↔ BE.**

- `FRONTEND_HOST` на Railway ДОЛЖЕН точно совпадать с Vercel URL
- С `https://`, без trailing slash
- Backend config: `backend/app/core/config.py` автоматически включает `FRONTEND_HOST` в CORS origins

## Docker

### Railway Dockerfile

- Файл: `backend/Dockerfile.railway`
- **Без BuildKit cache mounts** (`--mount=type=cache`) - Railway не поддерживает
- Конфиг: `railway.toml` (health check path, build command)

### Local Docker Compose

```bash
docker compose watch              # Dev с hot reload
docker compose up -d --wait       # Detached mode
docker compose down -v            # Stop + remove volumes
```

Файлы: `compose.yml` (prod) + `compose.override.yml` (dev overrides)

## MCP + CLI Pattern

**Правило:** MCP для чтения → CLI для записи/деструктивных операций.

| Операция | Инструмент |
|----------|-----------|
| List projects, services, deployments | MCP |
| Get logs, check status | MCP |
| Set variables (batch) | CLI (`railway variables set`) |
| Delete project/service | CLI (`railway delete`) |
| Deploy | MCP или CLI |
| Restart | CLI only |

Подробнее: `docs/help/mcp-vs-cli/railway-mcp-vs-cli.md`

## Health Checks

**Endpoint:** `GET /api/v1/utils/health-check/` → `{"status": true}`

После каждого деплоя:
1. Проверить health check
2. Мониторить логи 10 минут
3. Проверить что фронтенд загружается

## Process Tracking

**ВСЕ инфра-изменения** → `status-process.md` (корень проекта)

Формат: `[YYYY-MM-DD] action — description`

Что трекать:
- Настройка/изменение деплоя
- MCP серверы (add/remove/config)
- Агенты (add/remove/adapt)
- CI/CD, Docker изменения
- Env vars изменения
