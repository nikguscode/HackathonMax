package maxbot

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"os"

	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
)

// deleteMessage удаляет сообщение по его идентификатору
func (b *Bot) deleteMessage(ctx context.Context, messageID string) error {
	baseURL := "https://botapi.max.ru/messages"
	params := url.Values{}
	params.Add("message_id", messageID)
	params.Add("access_token", os.Getenv("BOT_TOKEN"))

	fullURL := baseURL + "?" + params.Encode()

	req, err := http.NewRequestWithContext(ctx, "DELETE", fullURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create delete request: %w", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send delete request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("delete message failed with status: %s", resp.Status)
	}

	return nil
}

func (b *Bot) SendComeOverRequest(ctx context.Context, idMax int64) error {
	keyboard := b.client.Messages.NewKeyboardBuilder()
	keyboard.AddRow().
		AddCallback("Да", schemes.POSITIVE, "member_yes").
		AddCallback("Нет", schemes.NEGATIVE, "member_no")

	message := maxbot.NewMessage().
		SetUser(idMax).
		AddKeyboard(keyboard).
		SetText("Сосал?:")

	_, err := b.client.Messages.SendMessageResult(ctx, message)

	return err
}
