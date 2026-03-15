---
date: 2026-03-16
agent: _direct
service: railway
severity: blocker
status: resolved
---

# Railway использует Railpack вместо Dockerfile по умолчанию

## Контекст
Первый деплой backend на Railway. В проекте есть `backend/Dockerfile`, но Railway его проигнорировал.

## Ошибка
```
Railpack 0.18.0
↳ Detected Python
↳ Using uv
✖ No start command was found.
```

## Причина
Railway по умолчанию использует Railpack (авто-детектор) вместо Dockerfile. Railpack нашёл `pyproject.toml` в корне проекта, определил Python, но не смог найти start command (потому что приложение в подпапке `backend/`).

## Решение / Workaround
Создать `railway.toml` в корне проекта:
```toml
[build]
dockerfilePath = "backend/Dockerfile.railway"

[deploy]
healthcheckPath = "/api/v1/utils/health-check/"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

## Рекомендация для промпта
Добавить в промпт DevOps агента:
> При деплое на Railway ВСЕГДА создавай `railway.toml` с явным указанием `dockerfilePath`. Railway по умолчанию использует Railpack авто-детектор, который часто некорректно определяет структуру monorepo-проектов.

## Статус
- [x] Запись создана
- [x] Workaround найден
- [ ] Промпт агента обновлён
