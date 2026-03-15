# Git Conventions

**Агенты:** все

---

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

### Types

| Type | Когда |
|------|-------|
| `feat` | Новая функциональность |
| `fix` | Исправление бага |
| `docs` | Документация |
| `refactor` | Рефакторинг без изменения поведения |
| `test` | Тесты |
| `chore` | Конфиги, билд, зависимости |

### Scopes

| Scope | Что покрывает |
|-------|--------------|
| `frontend` | React, Vite, компоненты, роуты |
| `backend` | FastAPI, модели, API routes |
| `infra` | Docker, Railway, Vercel, CORS |
| `ci` | GitHub Actions |
| `docker` | Dockerfiles, compose |

### Примеры

```
feat(backend): add incident auto-resolution on service recovery
fix(frontend): fix CORS error on login redirect
chore(infra): update Railway env vars for production
docs(backend): add API endpoint documentation
test(backend): add service CRUD tests
```

## Branching

- `master` - основная ветка, деплой идёт отсюда
- `feature/<name>` - фичи
- `fix/<name>` - баг-фиксы
- `chore/<name>` - инфра/конфиг изменения

## Pull Requests

```markdown
## Summary
- [1-3 пункта что сделано]

## Test plan
- [ ] Тесты проходят
- [ ] Проверено локально

🤖 Generated with Claude Code
```

## Правила

- Не коммитить `.env`, секреты, API keys
- Не force push на master
- Коммитить конкретные файлы (`git add <files>`), не `git add .`
- Один коммит - одна логическая единица изменений
