1. Стиль написания кода согласно Google Code Style Convention
2. Тип API: RESTful API, JSON соответствует Google JSON Style Guide

# Project Setup & Run Guide

Этот документ объясняет, как подготовить и запустить проект с помощью **Docker Compose**, а также где должен находиться файл `.env`.

## Как запустить проект

### 1. Установите Docker и Docker Compose

Если не установлены — скачайте с сайта Docker Desktop.

---

### 2. Создайте `.env`

Положите файл `.env` **рядом с `docker-compose.yml`** в папку `HackathonMax/shared`:

```
/docker-compose.yml
/.env
```

---

### 3. Запуск всего проекта

Запустить всё. В папке `HackathonMax/shared` выполнить:

```bash
docker compose --profile docker up -d --build
```

## Доступ к сервисам

| Сервис               | URL                                              |
| -------------------- | ------------------------------------------------ |
| Backend API          | [http://localhost:8080](http://localhost:8080)   |
| Analytics Service    | [http://localhost:8081](http://localhost:8081)   |
| Notification Service | [http://localhost:8082](http://localhost:8082)   |
| PgAdmin              | [http://localhost:5050](http://localhost:5050)   |
| RabbitMQ UI          | [http://localhost:15672](http://localhost:15672) |
| Frontend через Caddy | [http://localhost](http://localhost)             |

---

## Остановка

```bash
docker compose -p shared down -v
```
