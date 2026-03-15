---
date: 2026-03-16
agent: _direct
service: railway
severity: blocker
status: resolved
---

# Railway не поддерживает Docker BuildKit cache mounts

## Контекст
Деплой FastAPI бэкенда на Railway. Проект использует оригинальный `backend/Dockerfile` из FastAPI template.

## Ошибка
```
Cache mounts MUST be in the format --mount=type=cache,id=<cache-id>
```

## Причина
Оригинальный Dockerfile использует BuildKit-специфичные инструкции:
```dockerfile
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-workspace --package app
```

Railway's Docker builder не поддерживает `--mount=type=cache` и `--mount=type=bind`.

## Решение / Workaround
Создан отдельный `backend/Dockerfile.railway` без cache/bind mounts:
```dockerfile
# Вместо mount=bind — обычный COPY
COPY pyproject.toml uv.lock /app/
RUN uv sync --frozen --no-install-workspace --package app
```

В `railway.toml` указан путь к Railway-версии:
```toml
[build]
dockerfilePath = "backend/Dockerfile.railway"
```

## Рекомендация для промпта
Добавить в промпт DevOps агента:
> Railway НЕ поддерживает `--mount=type=cache` и `--mount=type=bind` в Dockerfile. Если проект использует BuildKit cache mounts, создавай отдельный `Dockerfile.railway` с обычными COPY инструкциями.

## Статус
- [x] Запись создана
- [x] Workaround найден
- [ ] Промпт агента обновлён
