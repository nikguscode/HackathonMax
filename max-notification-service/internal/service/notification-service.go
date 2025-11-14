package service

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"max-notification-service/internal/transport/maxbot"
)

type NotificationService struct {
	bot *maxbot.Bot
}

func NewNotificationService(bot *maxbot.Bot) *NotificationService {
	return &NotificationService{bot: bot}
}

// /notify
func (s *NotificationService) StartNotify(idMax int64) error {
	log.Printf("StartNotify called with idMax=%d", idMax)
	return s.bot.SendComeOverRequest(context.Background(), idMax)
}

// /callback
func (s *NotificationService) MemberAnswer(idMax int64, answer string) {
	log.Printf("MemberAnswer: idMax=%d, answer=%s", idMax, answer)

	url := fmt.Sprintf("%s/callback?id_max=%d&answer=%s", "https://webhook.site/5c55aa19-0b6c-4683-8282-ba1ea3460865", idMax, answer)
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("Failed to send webhook: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		log.Printf("Webhook returned error status: %s", resp.Status)
	} else {
		log.Printf("Webhook sent successfully: %s", url)
	}
}
