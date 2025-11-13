package service

import (
	"context"
	"log"
	"max-notification-service/internal/transport/maxbot"
)

type NotificationService struct {
	bot *maxbot.Bot
}

func NewNotificationService(bot *maxbot.Bot) *NotificationService {
	return &NotificationService{bot: bot}
}

func (s *NotificationService) StartNotify(idMax int64) error {
	return s.bot.SendComeOverRequest(context.Background(), idMax)
}

func (s *NotificationService) MemberAnswer(idMax int64, answer string) {
	log.Println("Member answer:", idMax, answer)
	// тут отправка ответа на фронт/очередь
}
