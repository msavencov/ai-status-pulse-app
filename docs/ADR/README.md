# Architecture Decision Records (ADR)

Записи об архитектурных решениях проекта StatusPulse.

**Формат:** каждый ADR - одно решение. Контекст → Решение → Последствия.

**Теги:** каждый ADR помечен тегами — агенты читают только ADR со своими тегами.

---

## Index

| ADR | Название | Теги | Статус |
|-----|---------|------|--------|
| [001](ADR-001-deploy-split-vercel-railway.md) | Frontend на Vercel, Backend на Railway | `devops`, `infra` | Accepted |
| [002](ADR-002-railway-dockerfile-no-buildkit.md) | Railway Dockerfile без BuildKit | `devops`, `docker` | Accepted |
| [003](ADR-003-mcp-read-cli-write.md) | MCP для чтения, CLI для записи | `devops`, `tooling` | Accepted |
| [004](ADR-004-no-signup-login-only.md) | Убрать signup, только login | `frontend`, `product` | Accepted |

## Теги и агенты

| Тег | Какие агенты читают |
|-----|-------------------|
| `devops` | devops |
| `infra` | devops |
| `docker` | devops |
| `tooling` | все |
| `frontend` | developer |
| `backend` | developer |
| `product` | все |
| `architecture` | technical-architect, developer |

## Как создавать новый ADR

1. Файл: `docs/ADR/ADR-NNN-short-slug.md`
2. Формат: Контекст → Решение → Последствия → Теги
3. Обновить этот README (таблицу Index)
4. Обновить `status-process.md`

**Когда создавать:**
- Выбор технологии/платформы
- Архитектурное решение которое сложно откатить
- Решение от которого зависят другие части системы
- НЕ создавать для мелких решений (стиль кода, naming)
