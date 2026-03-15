# Conventions

Конвенции проекта StatusPulse - правила и стандарты для разработки, деплоя, тестирования.

Каждый файл - отдельный домен. Агенты читают только свои конвенции (см. теги).

---

## Index

| Файл | Домен | Агенты | Описание |
|------|-------|--------|----------|
| [git.md](git.md) | Git | все | Коммиты, ветки, PR |
| [testing.md](testing.md) | Testing | developer, qa-engineer, devops | Тесты, workflow, правила |
| [devops.md](devops.md) | DevOps | devops | Деплой, env vars, Docker, CORS |

## Как использовать

**В манифестах агентов** ссылайся на конкретные файлы:
```yaml
documentation:
  required:
    - path: docs/conventions/git.md
    - path: docs/conventions/devops.md
```

**При добавлении новой конвенции:**
1. Создай файл в `docs/conventions/<domain>.md`
2. Добавь в эту таблицу с тегами агентов
3. Обнови манифесты агентов которым это нужно
