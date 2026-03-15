---
date: 2026-03-16
agent: _direct
service: vercel
severity: workaround
status: open
---

# Vercel CLI требует интерактивный login через браузер

## Контекст
Попытка задеплоить фронтенд через Vercel CLI из Claude Code.

## Ошибка
```
Error: No existing credentials found. Please run `vercel login` or pass "--token"
```

При попытке `vercel login`:
```
You must run the following command to log in: `vercel login`.
Run it without --non-interactive to complete sign-in in your browser.
```

## Причина
Vercel CLI требует OAuth авторизацию через браузер. Claude Code запускает команды в non-interactive режиме, поэтому `vercel login` не может открыть браузер.

## Решение / Workaround
Два варианта:
1. Пользователь выполняет `vercel login` вручную в терминале, затем Claude Code может использовать CLI
2. Использовать `--token` флаг с Vercel API token (можно создать в Settings → Tokens)
3. Подключить GitHub repo через Vercel Dashboard (без CLI)

## Рекомендация для промпта
Добавить в промпт DevOps агента:
> Vercel CLI требует интерактивный login (`vercel login` через браузер). НЕ пытайся логиниться через Bash — попроси пользователя выполнить `vercel login` в терминале, либо предложи подключить GitHub repo через Vercel Dashboard.

## Статус
- [x] Запись создана
- [x] Workaround найден (пользователь логинится вручную)
- [ ] Промпт агента обновлён
