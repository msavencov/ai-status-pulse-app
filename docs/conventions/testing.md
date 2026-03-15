# Testing Conventions

**Агенты:** developer, qa-engineer, devops

---

## Тестовый workflow

```
Developer пишет код → пишет/адаптирует тесты → запускает локально
    ↓
DevOps перед деплоем → проверяет: тесты проходят? → push
    ↓
CI/CD (GitHub Actions) → автоматический прогон → deploy
```

**ПРАВИЛО:** тесты ВСЕГДА перед деплоем. Нет зелёных тестов - нет push.

## Backend Tests (pytest)

```bash
cd backend && pytest                                    # Все тесты
cd backend && pytest tests/api/routes/test_services.py  # Один файл
cd backend && pytest -x                                 # Стоп на первом фейле
```

**Требования:**
- PostgreSQL должен быть запущен (Docker или локально)
- Тесты лежат в `backend/tests/`
- Именование: `test_<module>.py`

## Frontend E2E Tests (Playwright)

```bash
cd frontend && bunx playwright test                        # Все E2E
cd frontend && bunx playwright test --ui                   # UI режим
cd frontend && bunx playwright test tests/login.spec.ts    # Один файл
```

**Требования:**
- Full stack должен быть запущен (backend + frontend + DB)
- Тесты лежат в `frontend/tests/`
- Именование: `<feature>.spec.ts`

## Linters

| Стек | Линтер | Команда |
|------|--------|---------|
| Frontend | Biome | `cd frontend && bun run lint` |
| Backend | Ruff | `cd backend && uv run ruff check app/` |

Pre-commit hooks (prek) запускают оба линтера автоматически при коммите.

```bash
cd backend && uv run prek install -f     # Установить hooks
uv run prek run --all-files              # Запустить вручную
```
