package maxbot

import (
	"context"
	"log"
	"strconv"
	"strings"

	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
)

// сообщения
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

func (b *Bot) handleCallback(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	payload := update.Callback.Payload // формат "member_yes:123"
	parts := strings.Split(payload, ":")

	if len(parts) != 2 {
		log.Printf("Invalid callback payload: %s", payload)
		return nil
	}

	action := parts[0]
	idMax, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
		log.Printf("Invalid idMax in payload: %s", parts[1])
		return nil
	}

	if err := b.deleteMessage(ctx, update.Message.Body.Mid); err != nil {
		log.Printf("Failed to delete message: %v", err)
	}

	if b.OnAnswer != nil {
		ans := "no"
		if action == "member_yes" {
			ans = "yes"
		}
		b.OnAnswer(idMax, ans)
	}

	switch action {
	case "member_yes":
		return b.handleMemberComeOverYes(ctx, update)
	case "member_no":
		return b.handleMemberComeOverNo(ctx, update)
	default:
		log.Printf("Unknown action: %s", action)
	}
	return nil
}

// команды
func (b *Bot) handleStartCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	msg := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Добро пожаловать!")
	log.Print(update.Message.Sender.UserId)
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

func (b *Bot) handleHelpCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	msg := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Помощь")
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

func (b *Bot) handleDefaultCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	msg := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Команда не распознана")

	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

// кнопки
func (b *Bot) handleMemberComeOverYes(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	msg := maxbot.NewMessage().
		SetUser(update.Callback.User.UserId).
		SetText("Вы выбрали 'Да'")
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

func (b *Bot) handleMemberComeOverNo(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	msg := maxbot.NewMessage().
		SetUser(update.Callback.User.UserId).
		SetText("Вы выбрали 'Нет'")
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}
