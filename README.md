# Job Platform

[![Frontend tests](https://github.com/t3mm1k/job_platform/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/t3mm1k/job_platform/actions/workflows/frontend-tests.yml)

## Требования

Для развертывания системы необходимо установленное средство контейнеризации:

- **Windows / macOS**: Docker Desktop  
- **Linux**: Docker Engine  

Для локальной разработки фронтенда без Docker: **Node.js 20+** и npm.

## Тестирование и CI
- Локально из каталога `frontend`:

```bash
cd frontend
npm ci
npm run test:ci
```

Дополнительные скрипты в `frontend/package.json`:

| Команда | Назначение |
|--------|------------|
| `npm test` | watch-режим, все тесты при изменениях (`--watchAll`) |
| `npm run test:related` | watch только по файлам, связанным с изменениями |
| `npm run test:ci` | один прогон без watch (как в CI) |

## Установка и запуск (Docker)

### 1. Клонирование репозитория

```bash
git clone https://github.com/t3mm1k/job_platform.git
cd job_platform
```

### 2. Настройка

При необходимости отредактируйте `compose.yaml` (порты сервисов, переменные окружения для сборки фронта, например ключ карт).

### 3. Сборка и запуск проекта

```bash
docker compose up -d --build
```

После старта веб-интерфейс обычно доступен на порту, проброшенном для сервиса `web` (по умолчанию смотрите маппинг `8080:80` в `compose.yaml`).
