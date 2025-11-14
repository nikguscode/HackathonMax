package service

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"max-notification-service/internal/transport/maxbot"
)

type NotificationService struct {
	bot        *maxbot.Bot
	BackendURL string
}

func NewNotificationService(bot *maxbot.Bot, backURL string) *NotificationService {
	return &NotificationService{
		bot:        bot,
		BackendURL: backURL,
	}
}

// /notify
func (s *NotificationService) StartNotify(idMax int64) error {
	log.Printf("StartNotify called with idMax=%d", idMax)
	return s.bot.SendComeOverRequest(context.Background(), idMax)
}

// /callback
func (s *NotificationService) MemberAnswer(idMax int64, answer string) {
	log.Printf("MemberAnswer: idMax=%d, answer=%s", idMax, answer)

	url := fmt.Sprintf("http://%s/callback?id_max=%d&answer=%s", s.BackendURL, idMax, answer)
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("Failed to send: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		log.Printf("Returned error status: %s", resp.Status)
	} else {
		log.Printf("Sent successfully: %s", url)
	}
}
