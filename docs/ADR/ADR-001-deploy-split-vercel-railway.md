# ADR-001: Frontend на Vercel, Backend на Railway

**Дата:** 2026-03-16
**Статус:** Accepted
**Теги:** `devops`, `infra`

---

## Контекст

StatusPulse - full-stack приложение (React frontend + FastAPI backend + PostgreSQL). Нужно выбрать платформу для деплоя. Основной шаблон (FastAPI Full-Stack Template) рассчитан на единый сервер с Docker Compose и Traefik.

Варианты:
- **Один сервер (VPS)** — Docker Compose как есть
- **Один PaaS** — всё на Railway или всё на Vercel
- **Split** — Vercel (FE) + Railway (BE + DB)

## Решение

Split: **Vercel для фронтенда, Railway для бэкенда + PostgreSQL.**

Причины:
- **Vercel** оптимизирован для static/SPA — CDN, edge, мгновенный деплой, бесплатный tier
- **Railway** поддерживает persistent processes (background health checker) и managed PostgreSQL
- Vercel не подходит для бэкенда с background tasks (serverless ограничения)
- Railway не оптимален для static frontend (нет CDN)
- Оба имеют MCP серверы для автоматизации через Claude Code

## Последствия

**Плюсы:**
- Каждая платформа делает то, в чём сильна
- Бесплатные тиры для обеих платформ
- MCP интеграция для обеих

**Минусы:**
- Нужно настраивать CORS между двумя доменами
- `FRONTEND_HOST` на Railway должен точно совпадать с Vercel URL
- Два места для мониторинга вместо одного
- GitHub integration настраивается отдельно для каждой платформы
