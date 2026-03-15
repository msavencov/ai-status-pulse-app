---
date: 2026-03-16
agent: _direct
service: railway
severity: workaround
status: resolved
---

# Railway MCP: параметры-массивы не передаются корректно

## Контекст
Установка 13 переменных окружения для backend-сервиса через MCP tool `set-variables`.

## Ошибка
```
Invalid arguments for tool set-variables:
  Expected array, received string
```

Попытка передать как JSON-объект — та же ошибка. Попытка передать как JSON-массив строк — та же ошибка.

## Причина
Claude Code сериализует параметры как строки при передаче в MCP tools. Railway MCP ожидает нативный массив, но получает строковое представление. Несовместимость на уровне MCP protocol serialization.

Аналогичная проблема с `deploy-template` tool — параметр `templateIndex` ожидает number, получает string `"1"`.

## Решение / Workaround
Использовать Railway CLI напрямую через Bash:
```bash
railway variables set \
  'PROJECT_NAME=StatusPulse' \
  'ENVIRONMENT=production' \
  'POSTGRES_SERVER=${{Postgres.PGHOST}}' \
  ...
```

## Рекомендация для промпта
Добавить в промпт DevOps агента:
> Railway MCP tools с параметрами-массивами (`set-variables`) и числами (`deploy-template templateIndex`) НЕ работают корректно из-за несовместимости типов. Сразу используй CLI: `railway variables set 'KEY=VALUE'` для установки переменных. MCP используй только для чтения (list-variables, list-services, get-logs).

## Статус
- [x] Запись создана
- [x] Workaround найден
- [ ] Промпт агента обновлён
