# Документация Analytics Service

## 1. Описание проекта
Analytics Service собирает и предоставляет метрики по очередям и организациям.  
Сервис может работать в двух режимах:
- **HTTP**: предоставляет REST API для получения метрик и графиков.
- **RabbitMQ**: принимает команды в очереди, обрабатывает их и публикует результаты.

## 2. HTTP API

### 2.1 Health-check
**GET** `/health`  
**Описание:** Проверка состояния сервиса.  
**Ответ:**
200 OK
"OK"

### 2.2 Метрики организаций

**GET** `/organizations/:organizationId/metrics`
**Параметры URL:**

* `organizationId` — UUID организации

**Описание:** Возвращает JSON с основными метриками организации.

**Пример ответа:**

```json
{
  "status": "success",
  "data": {
    "metrics": {
      "numberOfActiveQueues": 5,
      "numberOfQueues": 10,
      "numberOfMembersInAllQueues": 42,
      "numberOfEmployees": 20,
      "membersInDay": 7,
      "waitingTime": 120.5,
      "averageLoadInQueues": 0.67,
      "numberOfServedMembers": 35
    }
  }
}
```

### 2.3 Графики организаций

**GET** `/organizations/:organizationId/graphics?from=YYYY-MM-DD&to=YYYY-MM-DD`
**Параметры URL:**

* `organizationId` — UUID организации
* `from` — дата начала графика (RFC3339)
* `to` — дата конца графика (RFC3339)

**Описание:** Возвращает JSON с графиками throughput и total load.

**Пример ответа:**

```json
{
  "graphics": {
    "throughputByTime": [
      {"time": "2025-11-15T08:00:00Z", "throughput": 5},
      {"time": "2025-11-15T09:00:00Z", "throughput": 7}
    ],
    "totalLoadByTime": [
      {"time": "2025-11-15T08:00:00Z", "totalLoad": 12},
      {"time": "2025-11-15T09:00:00Z", "totalLoad": 15}
    ]
  }
}
```

### 2.4 Метрики очередей

**GET** `/queues/:queueId/metrics`
**Параметры URL:**

* `queueId` — UUID очереди

**Описание:** Возвращает JSON с метриками конкретной очереди.

**Пример ответа:**

```json
{
  "metrics": {
    "waitingTime": 30.5,
    "entriesInTheQueue": 20,
    "numberOfServedMembers": 15,
    "serviceTime": 10.2,
    "totalLeft": 5,
    "maxInQueue": 8,
    "minInQueue": 2,
    "averageInQueue": 4
  }
}
```

### 2.5 Графики очередей

**GET** `/queues/:queueId/graphics?from=YYYY-MM-DD&to=YYYY-MM-DD`
**Параметры URL:**

* `queueId` — UUID очереди
* `from` — дата начала графика (RFC3339)
* `to` — дата конца графика (RFC3339)

**Пример ответа:**

```json
{
  "graphics": {
    "averageWaitingTimeByTime": [
      {"time": "2025-11-15T08:00:00Z", "waitingTime": 28.5},
      {"time": "2025-11-15T09:00:00Z", "waitingTime": 30.2}
    ],
    "membersInQueueByTime": [
      {"time": "2025-11-15T08:00:00Z", "count": 5},
      {"time": "2025-11-15T09:00:00Z", "count": 7}
    ]
  }
}
```

## 3. RabbitMQ потоки

### 3.1 Publisher

* Отправляет JSON-отчёты в указанную очередь или exchange.
* Метод: `PublishMetrics(report interface{})`
* Вход: любая структура отчёта (Metrics или Graphics).
* Ошибка возвращается, если не удалось сериализовать или отправить сообщение.

### 3.2 Consumer

* Подписывается на очередь RabbitMQ.
* Получает сообщения формата `MetricsCommand` и обрабатывает их через `MetricsService`.
* После генерации отчета публикует его через `Publisher`.

**Пример MetricsCommand:**

```json
{
  "type": "queue",
  "reportKind": "metrics",
  "id": "queue-uuid",
  "from": "2025-11-15T00:00:00Z",  
  "to": "2025-11-15T23:59:59Z"     
}
```

Поля:

* `type` — `"queue"` или `"organization"`
* `reportKind` — `"metrics"` или `"graphics"`
* `id` — UUID очереди или организации
* `from` и `to` — временной диапазон для графиков

### 3.3 Connection

* `NewConnection(url string)` — создаёт соединение с RabbitMQ и открывает канал.
* `Channel()` — возвращает канал для публикации/подписки.
* `Close()` — корректно закрывает канал и соединение.

---

## 4. Форматы JSON отчётов

### 4.1 OrganizationMetrics

```json
{
  "numberOfActiveQueues": 5,
  "numberOfQueues": 10,
  "numberOfMembersInAllQueues": 42,
  "numberOfEmployees": 20,
  "membersInDay": 7,
  "waitingTime": 120.5,
  "averageLoadInQueues": 0.67,
  "numberOfServedMembers": 35
}
```

### 4.2 OrganizationGraphics

```json
{
  "throughputByTime": [
    {"time": "2025-11-15T08:00:00Z", "throughput": 5}
  ],
  "totalLoadByTime": [
    {"time": "2025-11-15T08:00:00Z", "totalLoad": 12}
  ]
}
```

### 4.3 QueueMetrics

```json
{
  "waitingTime": 30.5,
  "entriesInTheQueue": 20,
  "numberOfServedMembers": 15,
  "serviceTime": 10.2,
  "totalLeft": 5,
  "maxInQueue": 8,
  "minInQueue": 2,
  "averageInQueue": 4
}
```

### 4.4 QueueGraphics

```json
{
  "averageWaitingTimeByTime": [
    {"time": "2025-11-15T08:00:00Z", "waitingTime": 28.5}
  ],
  "membersInQueueByTime": [
    {"time": "2025-11-15T08:00:00Z", "count": 5}
  ]
}
```
