---
date: 2026-03-16
agent: _direct
service: vercel
severity: insight
status: resolved
---

# Vercel MCP deploy tool не деплоит — только советует

## Контекст
Попытка задеплоить фронтенд через `mcp__vercel__deploy_to_vercel`.

## Ошибка
Не ошибка, но tool вернул текст:
```
To deploy this to Vercel, run the Vercel CLI command `vercel deploy`.
```

Вместо реального деплоя — просто совет использовать CLI.

## Причина
Vercel MCP `deploy_to_vercel` tool — информационный, не исполняющий. Он не запускает деплой, а объясняет как это сделать.

## Решение / Workaround
Использовать Vercel CLI:
```bash
cd frontend && VITE_API_URL=https://backend-xxx.up.railway.app vercel deploy --yes --prod
```

Или подключить GitHub repo через Vercel Dashboard (Import Project).

## Рекомендация для промпта
Добавить в промпт DevOps агента:
> `mcp__vercel__deploy_to_vercel` НЕ деплоит — это информационный tool. Для деплоя используй Vercel CLI (`vercel deploy --prod`) или GitHub integration. Vercel MCP полезен для: list_projects, get_deployment, get_build_logs, search_documentation.

## Статус
- [x] Запись создана
- [x] Workaround найден
- [ ] Промпт агента обновлён
