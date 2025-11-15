package maxbot

import (
	"context"
	"log"

	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
)

// Bot представляет MAX бота с клиентом API и колбэком на ответы участников.
type Bot struct {
	// client является клиентом API MAX бота.
	client *maxbot.Api

	// botID содержит идентификатор бота.
	botID int64

	// OnAnswer вызывается при нажатии кнопки участником.
	// Параметры:
	//   - idMax: идентификатор участника
	//   - answer: ответ участника
	OnAnswer func(idMax int64, answer string)
}

// NewBot создаёт новый экземпляр Bot с указанным токеном.
//
// Параметры:
//   - token: токен доступа к MAX API
//
// Возвращает:
//   - указатель на созданный Bot
//   - ошибку, если инициализация API или получение информации о боте не удалось
func NewBot(token string) (*Bot, error) {
	api, err := maxbot.New(token)
	if err != nil {
		return nil, err
	}

	ctx := context.Background()
	info, err := api.Bots.GetBot(ctx)
	if err != nil {
		return nil, err
	}

	return &Bot{
		client: api,
		botID:  info.UserId,
	}, nil
}

// Start запускает бота и слушает обновления от MAX API.
//
// Параметры:
//   - ctx: контекст для управления жизненным циклом бота
//
// Возвращает:
//   - ошибку, если запуск бота или получение информации о боте завершились неудачей
func (b *Bot) Start(ctx context.Context) error {
	info, err := b.client.Bots.GetBot(ctx)
	if err != nil {
		return err
	}

	log.Printf("Bot started: %s (@ID %d)", info.Name, info.UserId)

	for {
		select {
		case <-ctx.Done():
			log.Println("Bot context cancelled")
			return nil
		case upd, ok := <-b.client.GetUpdates(ctx):
			if !ok {
				log.Println("Updates channel closed")
				return nil
			}
			if err := b.handleUpdate(ctx, upd); err != nil {
				log.Printf("Error handling update: %v", err)
			}
		}
	}
}

// handleUpdate обрабатывает входящее обновление.
//
// В зависимости от типа обновления вызывает соответствующие методы:
//   - MessageCreatedUpdate - handleMessage
//   - MessageCallbackUpdate - handleCallback
//   - неизвестный тип - логируется как предупреждение
func (b *Bot) handleUpdate(ctx context.Context, upd schemes.UpdateInterface) error {
	switch u := upd.(type) {
	case *schemes.MessageCreatedUpdate:
		return b.handleMessage(ctx, u)
	case *schemes.MessageCallbackUpdate:
		return b.handleCallback(ctx, u)
	default:
		log.Printf("Unknown update type: %T", upd)
	}
	return nil
}
