package maxbot

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
)

func (b *Bot) handleMessage(ctx context.Context, update *schemes.MessageCreatedUpdate) error {

	switch strings.TrimSpace(update.GetCommand()) {
	case "/start":
		return b.handleStartCommand(ctx, update)
	case "/help":
		return b.handleHelpCommand(ctx, update)
	default:
		return b.handleDefaultCommand(ctx, update)
	}
}

func (b *Bot) handleStartCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	message := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Добро пожаловать!")

	_, err := b.client.Messages.SendMessageResult(ctx, message)
	return err
}

func (b *Bot) handleHelpCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	message := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Помощь")

	_, err := b.client.Messages.SendMessageResult(ctx, message)
	return err
}

func (b *Bot) handleDefaultCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {

	message := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("default")

	_, err := b.client.Messages.SendMessageResult(ctx, message)

	log.Print(update.Message.Body.Seq)

	return err
}

func (b *Bot) handleMemberComeOverYes(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	log.Printf("Member %d say: yes", update.GetUserID())

	if err := b.deleteMessage(ctx, update.Message.Body.Mid); err != nil {
		log.Printf("Failed to delete message: %v", err)
		return err
	}

	confirmMessage := maxbot.NewMessage().
		SetUser(update.Callback.User.UserId).
		SetText("Отлично! Вы выбрали 'Да'")

	_, err := b.client.Messages.SendMessageResult(ctx, confirmMessage)
	return err
}

func (b *Bot) handleMemberComeOverNo(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	log.Printf("Member %d say: no", update.GetUserID())

	if err := b.deleteMessage(ctx, update.Message.Body.Mid); err != nil {
		log.Printf("Failed to delete message: %v", err)
		return err
	}

	confirmMessage := maxbot.NewMessage().
		SetUser(update.Callback.User.UserId).
		SetText("Вы выбрали 'Нет'")

	_, err := b.client.Messages.SendMessageResult(ctx, confirmMessage)
	return err
}

func (b *Bot) handleCallback(ctx context.Context, update *schemes.MessageCallbackUpdate) error {

	switch update.Callback.Payload {
	case "member_yes":
		_ = b.sendResultToServer(update.GetUserID(), "yes")
		return b.handleMemberComeOverYes(ctx, update)
	case "member_no":
		_ = b.sendResultToServer(update.GetUserID(), "no")
		return b.handleMemberComeOverNo(ctx, update)
	}

	return nil
}

func (b *Bot) sendResultToServer(idMax int64, answer string) error {
	url := fmt.Sprintf("https://webhook.site/5c55aa19-0b6c-4683-8282-ba1ea3460865/callback?id_max=%d&answer=%s", idMax, answer)
	_, err := http.Get(url)
	return err
}
