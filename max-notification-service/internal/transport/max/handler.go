package max

import (
	"context"
	"log"
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
	case "/test":
		return b.handleComeOverCommand(ctx, update) // NO REALSE CASE (ONLY FOR TEST)
	default:
		return b.handleDefaultCommand(ctx, update)
	}
}

func (b *Bot) handleStartCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	message := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Добро пожаловать!")

	_, err := b.client.Messages.Send(ctx, message)
	return err
}

func (b *Bot) handleHelpCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	message := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Помощь")

	_, err := b.client.Messages.Send(ctx, message)
	return err
}

func (b *Bot) handleDefaultCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	message := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("default")

	_, err := b.client.Messages.Send(ctx, message)
	return err
}

func (b *Bot) handleComeOverCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	keyboard := b.client.Messages.NewKeyboardBuilder()
	keyboard.AddRow().
		AddCallback("Да", schemes.POSITIVE, "member_yes").
		AddCallback("Нет", schemes.NEGATIVE, "member_no")

	message := maxbot.NewMessage().
		SetUser(update.Message.Sender.UserId).
		AddKeyboard(keyboard).
		SetText("Выберите вариант:")

	_, err := b.client.Messages.Send(ctx, message)
	return err
}

func (b *Bot) handleMemberComeOverYes(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	log.Printf("Member %s say: yes", update.GetUserID())

	return nil
}

func (b *Bot) handleMemberComeOverNo(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	log.Printf("Member %s say: no", update.GetUserID())

	return nil
}
