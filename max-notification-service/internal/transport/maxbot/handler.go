package maxbot

import (
	"context"
	"log"
	"strconv"
	"strings"

	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
)

// handleMessage обрабатывает входящее текстовое сообщение.
//
// В зависимости от команды сообщения вызывает соответствующие методы:
//   - /start - handleStartCommand
//   - /help - handleHelpCommand
//   - любая другая команда - handleDefaultCommand
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

// handleCallback обрабатывает нажатие кнопок пользователем.
//
// Параметры:
//   - ctx: контекст для управления запросами
//   - update: объект колбэка от пользователя
//
// Функция:
//   - извлекает действие и idMax из payload
//   - удаляет сообщение через deleteMessage
//   - вызывает OnAnswer колбэк, если установлен
//   - обрабатывает действия "member_yes" и "member_no" через соответствующие методы
func (b *Bot) handleCallback(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	payload := update.Callback.Payload
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

// handleStartCommand обрабатывает команду /start.
// Отправляет приветственное сообщение пользователю с инструкцией по использованию бота.
func (b *Bot) handleStartCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	msg := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Добро пожаловать! Для того чтобы запичаться в очередь необходимо отсканировать QR-код. Вы можете контролировать свои очереди в нашем мини-приложении")
	log.Print(update.Message.Sender.UserId)
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

// handleHelpCommand обрабатывает команду /help.
// Отправляет пользователю подсказку по использованию мини-приложения.
func (b *Bot) handleHelpCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	msg := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Откройте мини-приложение")
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

// handleDefaultCommand обрабатывает неизвестные команды.
// Отправляет пользователю сообщение о том, что команда не распознана.
func (b *Bot) handleDefaultCommand(ctx context.Context, update *schemes.MessageCreatedUpdate) error {
	msg := maxbot.NewMessage().
		SetChat(update.Message.Recipient.ChatId).
		SetText("Команда не распознана. Напишите /help")

	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

// handleMemberComeOverYes обрабатывает нажатие кнопки "Да".
func (b *Bot) handleMemberComeOverYes(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	msg := maxbot.NewMessage().
		SetUser(update.Callback.User.UserId).
		SetText("Вы выбрали 'Да'")
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}

// handleMemberComeOverNo обрабатывает нажатие кнопки "Нет".
func (b *Bot) handleMemberComeOverNo(ctx context.Context, update *schemes.MessageCallbackUpdate) error {
	msg := maxbot.NewMessage().
		SetUser(update.Callback.User.UserId).
		SetText("Вы выбрали 'Нет'")
	_, err := b.client.Messages.SendMessageResult(ctx, msg)
	return err
}
