# Status Process

Статус проекта StatusPulse: история, инфраструктура, деплой, инструментарий.

---

## Project URLs

| Сервис | URL | Платформа |
|--------|-----|-----------|
| **Frontend** | https://status-pulse-app-frontend.vercel.app | Vercel |
| **Backend API** | https://backend-production-276a.up.railway.app | Railway |
| **Swagger UI** | https://backend-production-276a.up.railway.app/docs | Railway |
| **Health Check** | https://backend-production-276a.up.railway.app/api/v1/utils/health-check/ | Railway |
| **GitHub Repo** | https://github.com/Serg1kk/status-pulse-app | GitHub |
| **Railway Dashboard** | https://railway.com/project/a536eb07-6dd6-43d0-a8e7-c4b74727523c | Railway |

---

## Project History (для демки)

### Происхождение
- **Базовый шаблон:** [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template) от Tiangolo (автора FastAPI)
- **Что это:** production-ready full-stack шаблон: FastAPI + React + PostgreSQL + Docker + Traefik + CI/CD
- **Что мы с ним сделали:** клонировали и переделали в StatusPulse — сервис мониторинга статуса сервисов

### Что доработали из шаблона
1. **Заменили Item модель** → Service + HealthCheck + Incident (status page)
2. **Публичная страница статуса** — без авторизации, auto-refresh каждые 30 сек
3. **Админ-панель** — управление сервисами и инцидентами (CRUD)
4. **Background health checker** — async задача в FastAPI lifespan, пингует сервисы каждые 60 сек
5. **Auto-incidents** — автоматическое создание/закрытие инцидентов при падении/восстановлении

### Инфраструктура и инструментарий (обвязка Claude Code)
1. **MCP серверы** — Vercel + Railway (локально в `.mcp.json`)
2. **Субагент DevOps** — `.claude/agents/devops.md` (первый агент из X0 Framework)
3. **Манифесты агентов** — `docs/manifests/agents/` (из X0 Framework)
4. **Agent Learnings** — `docs/agent-learnings/` (самоулучшение промптов через логирование ошибок)
5. **Session History** — `session-history/` + команда `/save-session`
6. **Docs структура:**
   - `docs/roadmap.md` — roadmap проекта
   - `docs/backlog/` — фичи (001-status-pulse-base)
   - `docs/help/` — справочники (subagent frontmatter, MCP vs CLI, agent manifests)
   - `docs/agent-learnings/` — лог ошибок агентов
   - `docs/manifests/` — манифесты агентов

### Деплой
- **Frontend** → Vercel (static Vite build, GitHub integration, auto-deploy on push)
- **Backend** → Railway (Dockerfile.railway, ручной deploy через MCP/CLI)
- **PostgreSQL** → Railway (managed, reference variables)
- **Разделение:** git push триггерит Vercel автоматически, Railway — вручную

### Стек технологий
- **Backend:** FastAPI + SQLModel + PostgreSQL + Alembic + uv
- **Frontend:** React 19 + TypeScript + Vite 7 + TanStack Router/Query + shadcn/ui + Tailwind 4
- **Тесты:** pytest (backend) + Playwright (E2E) — от оригинального шаблона, нужна адаптация
- **CI/CD:** GitHub Actions (workflows от шаблона, нужна адаптация)

---

## MCP Servers

### Vercel MCP
- **Статус:** подключен, авторизован
- **Endpoint:** `https://mcp.vercel.com` (remote, OAuth)
- **Возможности:** docs search, list projects/deployments, build logs
- **Ограничение:** `deploy_to_vercel` tool не деплоит (информационный)

### Railway MCP
- **Статус:** подключен, авторизован
- **Package:** `@railway/mcp-server` (npx, обёртка над CLI)
- **Возможности:** create/list projects/services, deploy, set vars, get logs
- **Ограничения:** нет delete/restart, проблемы с типизацией массивов/чисел
- **Паттерн:** MCP для чтения → CLI для записи

---

## Agents

| Агент | Файл | Источник |
|-------|------|----------|
| DevOps | `.claude/agents/devops.md` | X0 Framework (адаптирован) |

---

## Commands

| Команда | Файл | Назначение |
|---------|------|-----------|
| `/save-session` | `.claude/commands/save-session.md` | Выжимка текущей сессии |

---

## Changelog

| Дата | Действие | Описание |
|------|----------|----------|
| 2026-03-15 | Project created | Клон FastAPI template, доработка в StatusPulse (Service/HealthCheck/Incident) |
| 2026-03-16 | MCP added | Vercel MCP + Railway MCP (локально в `.mcp.json`) |
| 2026-03-16 | Agent added | DevOps субагент из X0 Framework |
| 2026-03-16 | Docs restructure | roadmap, backlog, help, manifests, agent-learnings |
| 2026-03-16 | Deploy: Railway | Backend + PostgreSQL на Railway (Dockerfile.railway) |
| 2026-03-16 | Deploy: Vercel | Frontend на Vercel (GitHub integration) |
| 2026-03-16 | Command added | `/save-session` — сохранение истории сессии |
| 2026-03-16 | CLAUDE.md | Полная конфигурация: subagents, agent-learnings, session history, docs structure |
| 2026-03-16 | Fix: TS build | Route tree (items→services), Zod v4 + RHF v5 типы |
| 2026-03-16 | Fix: Dockerfile | Railway-совместимый Dockerfile без BuildKit cache mounts |
