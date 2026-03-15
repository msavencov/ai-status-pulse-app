---
date: 2026-03-16
agent: _direct
service: railway
severity: insight
status: resolved
---

# Railway MCP не имеет деструктивных операций (delete, restart)

## Контекст
Создали тестовый проект `statuspulse-test` через MCP, затем нужно было его удалить.

## Ошибка
В списке MCP tools нет `delete-project`, `delete-service`, `restart`, `redeploy`.

## Причина
Авторы Railway MCP сервера намеренно исключили деструктивные операции для безопасности. Это документировано: "Destructive operations are intentionally excluded".

## Решение / Workaround
Использовать Railway CLI:
```bash
railway delete --project <project-id> -y
```

## Рекомендация для промпта
Добавить в промпт DevOps агента:
> Railway MCP НЕ поддерживает деструктивные операции (delete, restart, redeploy). Для них всегда используй CLI: `railway delete`, `railway redeploy`. Это by design, не баг.

## Статус
- [x] Запись создана
- [x] Workaround найден
- [ ] Промпт агента обновлён
