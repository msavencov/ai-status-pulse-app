# Agent Manifest Adaptation Guide

Гайд по адаптации манифестов агентов из X0 Framework (или любого внешнего источника) под конкретный проект.

**Зачем:** X0 Framework предоставляет generic-манифесты. Они содержат примеры на Node.js/npm, ссылки на `docs/conventions.md`, GitHub MCP и другие вещи, которых в проекте может не быть. Без адаптации агент будет ссылаться на несуществующие файлы и использовать неправильные инструменты.

---

## Что адаптировать

### 1. Три файла агента

| Файл | Путь | Что содержит |
|------|------|-------------|
| **Промпт** | `.claude/agents/<name>.md` | Frontmatter + системный промпт агента. **Это то, что агент реально читает.** |
| **Manifest MD** | `docs/manifests/agents/<name>.md` | Детальный воркфлоу, чеклисты, примеры. Промпт ссылается сюда. |
| **Manifest YAML** | `docs/manifests/agents/<name>.yaml` | Машиночитаемые метаданные (capabilities, tools, workflow stages). |

### 2. Чеклист адаптации

Пройди каждый пункт для каждого из трёх файлов:

#### A. Tools & MCP серверы

- [ ] **Убрать MCP серверы**, которых нет в проекте (проверь `.mcp.json`)
- [ ] **Добавить MCP серверы**, которые есть в проекте и нужны агенту
- [ ] **Обновить список tools** в frontmatter промпта
- [ ] **Документировать ограничения MCP** (если есть — ссылка на `docs/help/mcp-vs-cli/`)

**Пример:** X0 DevOps использует `mcp__github` — в нашем проекте его нет, git через CLI.

#### B. Documentation References

- [ ] **Убрать ссылки на несуществующие файлы:** `docs/conventions.md`, `docs/ADR/`, etc.
- [ ] **Добавить ссылки на реальные файлы проекта:** `CLAUDE.md`, `status-process.md`, backlog, etc.
- [ ] **Проверить секции:** если ссылаешься на секцию файла — убедись что она существует

**Пример:** X0 ссылается на `docs/conventions.md` Section 6/7 — у нас этого нет, конвенции в `CLAUDE.md`.

#### C. Технологический стек

- [ ] **Package managers:** npm/yarn → bun (frontend), pip → uv (backend)
- [ ] **Команды сборки:** `npm run build` → `bun run build`, `npm test` → `pytest`
- [ ] **Фреймворки:** generic Next.js → конкретный React+Vite / FastAPI
- [ ] **Deployment platforms:** generic Vercel CLI → конкретные MCP + CLI паттерны
- [ ] **Языки примеров:** JavaScript health checks → Python FastAPI endpoints

**Пример:** X0 использует `npm ci && npm run build` — у нас `bun run build` (FE), `uv sync` (BE).

#### D. Workflow & Examples

- [ ] **Заменить generic примеры** на реальные из проекта
- [ ] **Обновить URLs** — deployment URLs, health check endpoints
- [ ] **Обновить env vars** — реальные переменные проекта
- [ ] **Обновить Docker commands** — под реальные Dockerfiles проекта
- [ ] **Убрать неприменимые сценарии** (staging если нет staging, Sentry если нет Sentry)

#### E. Metadata

- [ ] **version** → `2.0.0` (или выше, показывает что адаптирован)
- [ ] **updated_at** → текущая дата
- [ ] **Добавить `adapted_from`** → "X0 Framework v1.0.0" (трекинг происхождения)

---

## Процесс адаптации (пошагово)

### Step 1: Собери контекст проекта

Перед адаптацией прочитай:
- `.mcp.json` — какие MCP серверы подключены
- `CLAUDE.md` — архитектура, стек, deploy URLs, команды
- `status-process.md` — текущее состояние инфры

### Step 2: Сравни X0 манифест с реальностью

Пройди по каждой секции манифеста и отметь:
- **KEEP** — применимо как есть
- **ADAPT** — идея верная, но детали (команды, URLs, tools) нужно обновить
- **REMOVE** — не применимо к проекту (другой стек, нет инструмента)
- **ADD** — в проекте есть что-то, чего нет в X0 (специфичные MCP, паттерны)

### Step 3: Адаптируй файлы

Порядок:
1. **Промпт** (`.claude/agents/<name>.md`) — самый важный, агент его читает
2. **Manifest MD** (`docs/manifests/agents/<name>.md`) — промпт ссылается сюда
3. **Manifest YAML** (`docs/manifests/agents/<name>.yaml`) — машиночитаемые данные

### Step 4: Верифицируй

- [ ] Все ссылки на файлы — файлы существуют
- [ ] Все MCP серверы — есть в `.mcp.json`
- [ ] Все команды — работают в проекте (`bun`, `uv`, `pytest`, etc.)
- [ ] URLs — актуальные deployment URLs
- [ ] Нет generic примеров (example.com, placeholder values)

### Step 5: Обнови трекинг

- [ ] Обновить таблицу субагентов в `CLAUDE.md`
- [ ] Добавить запись в `status-process.md`

---

## Пример: DevOps адаптация (2026-03-16)

### Что убрали (REMOVE)

| Что | Почему |
|-----|--------|
| `mcp__github` (MCP интеграция) | Нет GitHub MCP в проекте. Git через CLI |
| `docs/conventions.md` reference | Файл не существует. Конвенции в CLAUDE.md |
| `docs/ADR/` reference | Нет ADR в проекте |
| `npm ci`, `npm run build`, `npm test` | Не используем npm |
| Sentry integration (error tracking) | Нет Sentry в проекте |
| JavaScript health check examples | Backend на Python |
| Generic Vercel CLI commands (`vercel deploy`) | Используем Vercel MCP + GitHub auto-deploy |
| Generic monitoring (UptimeRobot, Pingdom, APM) | Не настроено, StatusPulse сам мониторит |
| Staging environment references | Нет staging, только production |
| `slack-cli` alert commands | Нет Slack интеграции |

### Что адаптировали (ADAPT)

| Что | Было (X0) | Стало (StatusPulse) |
|-----|-----------|---------------------|
| Package manager | npm/yarn | bun (FE), uv (BE) |
| Build command | `npm run build` | `bun run build` (FE), `pytest` (BE) |
| Linter | generic | `bun run lint` (Biome), `ruff check` (Python) |
| Deploy platform | generic Vercel CLI | Vercel MCP + Railway MCP/CLI |
| Health check | JS endpoint | `GET /api/v1/utils/health-check/` (FastAPI) |
| Env vars | generic | 13 конкретных Railway vars с reference variables |
| Docker | generic | `Dockerfile.railway` (без BuildKit cache mounts) |
| URLs | example.com | Реальные Vercel + Railway URLs |
| Commit format | GitHub MCP | git CLI + HEREDOC |
| Documentation refs | conventions.md, ADR/ | CLAUDE.md, status-process.md, mcp-vs-cli/ |

### Что добавили (ADD)

| Что | Почему |
|-----|--------|
| CORS configuration section | Критично для связи FE ↔ BE, была проблема при деплое |
| Railway MCP limitations & workarounds | Реальный опыт: типизация ломается, нет деструктивных ops |
| Railway reference variables (`${{Postgres.PGHOST}}`) | Специфика managed PostgreSQL на Railway |
| `Dockerfile.railway` specifics | Отдельный Dockerfile без BuildKit (Railway не поддерживает) |
| Known Issues section | Конкретные баги и workaround-ы из деплоя |
| `status-process.md` tracking requirement | Обязательный лог изменений (проектная конвенция) |
| Agent learnings reference | Система самоулучшения агентов |

---

## Автоматизация в будущем

Текущий процесс — ручной. Потенциальные улучшения:

1. **Скрипт валидации** — проверяет что все ссылки в манифесте существуют в проекте
2. **Шаблон адаптации** — KEEP/ADAPT/REMOVE/ADD чеклист для каждого нового агента
3. **Claude Code command** `/adapt-agent` — автоматическая адаптация с промптом контекста

---

**Создано:** 2026-03-16
**Обновлено:** 2026-03-16
