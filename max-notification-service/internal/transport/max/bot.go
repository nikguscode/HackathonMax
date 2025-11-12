package max

import (
	"context"
	"log"

	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
)

type Bot struct {
	client *maxbot.Api
	botID  int64
}

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

func (b *Bot) Start(ctx context.Context) error {
	info, err := b.client.Bots.GetBot(ctx)
	if err != nil {
		return err
	}
	log.Printf("Bot started: %s (@%s)", info.Name, info.Username)

	for {
		select {
		case <-ctx.Done():
			log.Println("Bot context cancelled, stopping...")
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

func (b *Bot) handleUpdate(ctx context.Context, upd schemes.UpdateInterface) error {
	switch update := upd.(type) {
	case *schemes.MessageCreatedUpdate:
		err := b.handleMessage(ctx, update)
		if err.(*schemes.Error).Message.Stat == nil {
			return nil
		}
		return err

	case *schemes.MessageCallbackUpdate:
		return b.handleCallback(ctx, update)

	default:
		log.Printf("Unknown update type: %T", upd)
	}
	return nil
}
