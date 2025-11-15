# Пакет `maxbot`

Пакет `maxbot` предоставляет функционал для работы с ботом MAX, включая отправку сообщений, обработку команд, колбэков и управление очередями пользователей.

## Структура `Bot`

```go
type Bot struct {
    client   *maxbot.Api
    botID    int64
    OnAnswer func(idMax int64, answer string) // колбэк на нажатие кнопки
}
````

**Поля:**

* `client` — клиент MAX API для отправки и получения сообщений.
* `botID` — идентификатор бота.
* `OnAnswer` — функция обратного вызова при нажатии кнопки пользователем.

  * Параметры:

    * `idMax` — идентификатор участника.
    * `answer` — ответ участника (`"yes"` или `"no"`).

## Функции

### `NewBot`

```go
func NewBot(token string) (*Bot, error)
```

Создаёт новый экземпляр бота с указанным токеном.

**Параметры:**

* `token` — токен доступа к MAX API.

**Возвращает:**

* Указатель на `Bot`.
* Ошибку, если инициализация API или получение информации о боте не удалось.

### `Start`

```go
func (b *Bot) Start(ctx context.Context) error
```

Запускает бота и слушает обновления от MAX API.

**Параметры:**

* `ctx` — контекст для управления жизненным циклом бота.

**Возвращает:**

* Ошибку, если запуск бота или получение информации о боте завершились неудачей.

### `handleUpdate`

```go
func (b *Bot) handleUpdate(ctx context.Context, upd schemes.UpdateInterface) error
```

Обрабатывает входящее обновление. В зависимости от типа обновления вызывает соответствующие методы:

* `MessageCreatedUpdate` → `handleMessage`
* `MessageCallbackUpdate` → `handleCallback`
* Неизвестный тип → логируется как предупреждение.

### `deleteMessage`

```go
func (b *Bot) deleteMessage(ctx context.Context, messageID string) error
```

Удаляет сообщение по его идентификатору через API MAX бота.

**Параметры:**

* `ctx` — контекст для управления запросом (отмена, таймаут).
* `messageID` — идентификатор сообщения для удаления.

**Возвращает:**

* Ошибку, если запрос не удалось отправить или сервер вернул статус != 200.

### `SendComeOverRequest`

```go
func (b *Bot) SendComeOverRequest(ctx context.Context, idMax int64) error
```

Отправляет пользователю сообщение с кнопками `"Да"` и `"Нет"`.

**Параметры:**

* `ctx` — контекст для управления запросом.
* `idMax` — идентификатор пользователя MAX.

**Возвращает:**

* Ошибку, если отправка сообщения через API бота не удалась.

### `handleMessage`

```go
func (b *Bot) handleMessage(ctx context.Context, update *schemes.MessageCreatedUpdate) error
```

Обрабатывает входящее текстовое сообщение.

**Поведение:**

* `/start` → `handleStartCommand`
* `/help` → `handleHelpCommand`
* Любая другая команда → `handleDefaultCommand`.

### `handleCallback`

```go
func (b *Bot) handleCallback(ctx context.Context, update *schemes.MessageCallbackUpdate) error
```

Обрабатывает нажатие кнопок пользователем.

**Поведение:**

* Извлекает действие и `idMax` из payload.
* Удаляет сообщение через `deleteMessage`.
* Вызывает колбэк `OnAnswer`, если установлен.
* Обрабатывает действия `"member_yes"` и `"member_no"` через соответствующие методы.

### Команды

#### `handleStartCommand`

```go
func (b *Bot) handleStartCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error
```

Отправляет приветственное сообщение пользователю с инструкцией по использованию бота.

#### `handleHelpCommand`

```go
func (b *Bot) handleHelpCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error
```

Отправляет пользователю подсказку по использованию мини-приложения.

#### `handleDefaultCommand`

```go
func (b *Bot) handleDefaultCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error
```

Отправляет пользователю сообщение о том, что команда не распознана.

### Кнопки

#### `handleMemberComeOverYes`

```go
func (b *Bot) handleMemberComeOverYes(ctx context.Context, update *schemes.MessageCallbackUpdate) error
```

Отправляет пользователю подтверждающее сообщение `"Вы выбрали 'Да'"`.

#### `handleMemberComeOverNo`

```go
func (b *Bot) handleMemberComeOverNo(ctx context.Context, update *schemes.MessageCallbackUpdate) error
```

Отправляет пользователю подтверждающее сообщение `"Вы выбрали 'Нет'"`.
