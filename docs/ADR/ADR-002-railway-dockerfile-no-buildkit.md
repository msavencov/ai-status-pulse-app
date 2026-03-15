# ADR-002: Railway Dockerfile без BuildKit

**Дата:** 2026-03-16
**Статус:** Accepted
**Теги:** `devops`, `docker`

---

## Контекст

Оригинальный `backend/Dockerfile` из FastAPI шаблона использует BuildKit cache mounts (`--mount=type=cache,target=/root/.cache/uv`) для ускорения сборки зависимостей. Railway при билде Docker-образов не поддерживает BuildKit cache mounts - билд падает с ошибкой.

## Решение

Создать отдельный **`backend/Dockerfile.railway`** без BuildKit cache mounts. Оригинальный `Dockerfile` сохранить для локальной разработки.

```dockerfile
# Dockerfile.railway - без --mount=type=cache
RUN uv sync --frozen --no-install-project --no-dev

# Dockerfile (original) - с cache mounts для локальной скорости
RUN --mount=type=cache,target=/root/.cache/uv uv sync --frozen --no-install-project --no-dev
```

Railway указывает на `Dockerfile.railway` через `railway.toml`.

## Последствия

**Плюсы:**
- Деплой на Railway работает
- Локальная сборка остаётся быстрой (с cache mounts)

**Минусы:**
- Два Dockerfile для бэкенда (дублирование)
- При изменении зависимостей нужно обновлять оба
- Railway билд медленнее (без кэша)
