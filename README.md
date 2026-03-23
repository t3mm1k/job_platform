# Job Platform

## Требования

Для развертывания системы необходимо установленное средство контейнеризации:

- **Windows / macOS**: Docker Desktop  
- **Linux**: Docker Engine  

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/t3mm1k/job_platform.git
cd job_platform
```

### 2. Настройка

Перед запуском необходимо указать порт базы данных в файле compose.yaml.

### 3. Сборка и запуск проекта
```bash
docker compose up -d --build
```