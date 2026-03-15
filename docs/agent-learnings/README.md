# Agent Learnings

Лог ошибок, workaround'ов и инсайтов агентов. Используется для самоулучшения промптов.

---

## Назначение

Когда агент (или Claude напрямую) сталкивается с ошибкой, ограничением сервиса или находит неочевидный workaround — это логируется здесь. Периодически записи анализируются и на их основе обновляются промпты агентов.

## Структура

```
docs/agent-learnings/
├── README.md              ← Этот файл (описание системы + индекс)
├── devops/                ← Записи по агенту devops
│   ├── 2026-03-16_railway-buildkit-cache.md
│   ├── 2026-03-16_railway-mcp-array-params.md
│   └── ...
├── developer/             ← Записи по агенту developer (когда появится)
└── _direct/               ← Записи когда Claude работал напрямую (без агента)
```

## Формат записи

Файл: `docs/agent-learnings/<agent-name>/YYYY-MM-DD_short-slug.md`

```markdown
---
date: YYYY-MM-DD
agent: devops | developer | _direct | ...
service: railway | vercel | github | docker | ...
severity: blocker | workaround | insight
status: open | resolved | incorporated
---

# Краткое описание проблемы

## Контекст
Что делали, какая задача.

## Ошибка
Точный текст ошибки или описание проблемы.

## Причина
Почему это произошло (если известно).

## Решение / Workaround
Как обошли проблему.

## Рекомендация для промпта
Что добавить/изменить в промпте агента чтобы избежать в будущем.

## Статус
- [ ] Запись создана
- [ ] Workaround найден
- [ ] Промпт агента обновлён
```

## Поля frontmatter

| Поле | Значения | Описание |
|------|----------|----------|
| **date** | YYYY-MM-DD | Дата инцидента |
| **agent** | имя агента или `_direct` | Кто столкнулся с проблемой |
| **service** | railway, vercel, github, docker... | Внешний сервис где возникла проблема |
| **severity** | `blocker` / `workaround` / `insight` | blocker = остановил работу, workaround = обошли, insight = полезное наблюдение |
| **status** | `open` / `resolved` / `incorporated` | open = проблема есть, resolved = workaround найден, incorporated = промпт обновлён |

## Жизненный цикл записи

```
Ошибка → Запись (status: open)
       → Workaround найден (status: resolved)
       → Промпт агента обновлён (status: incorporated)
```

Записи со статусом `incorporated` — архив. Их можно не читать каждый раз, но полезно для истории.

## Правила

1. **ОБЯЗАТЕЛЬНО** логировать если:
   - MCP tool вернул ошибку (типизация, отсутствующий метод)
   - Деплой упал (Dockerfile, конфиг, env vars)
   - CLI команда дала неожиданный результат
   - Сервис повёл себя не как в документации

2. **ЖЕЛАТЕЛЬНО** логировать если:
   - Нашёл неочевидный workaround
   - Документация сервиса устарела
   - Есть лучший способ сделать что-то

3. **НЕ ЛОГИРОВАТЬ:**
   - Опечатки и синтаксические ошибки
   - Одноразовые проблемы (сеть упала, таймаут)

## Индекс записей

### devops

| Дата | Файл | Severity | Service | Статус |
|------|------|----------|---------|--------|
| 2026-03-16 | `railway-buildkit-cache.md` | blocker | Railway | resolved |
| 2026-03-16 | `railway-mcp-array-params.md` | workaround | Railway | resolved |
| 2026-03-16 | `railway-mcp-delete-missing.md` | insight | Railway | resolved |
| 2026-03-16 | `railway-railpack-no-dockerfile.md` | blocker | Railway | resolved |
| 2026-03-16 | `vercel-mcp-deploy-noop.md` | insight | Vercel | resolved |
| 2026-03-16 | `vercel-cli-login-interactive.md` | workaround | Vercel | open |
