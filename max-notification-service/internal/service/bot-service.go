package service

import (
	"context"
	"max-notification-service/internal/transport/max"
)

type BotService struct {
	bot *max.Bot
}

func NewBotService(bot *max.Bot) *BotService {
	return &BotService{bot: bot}
}

func (s *BotService) Run(ctx context.Context) error {
	return s.bot.Start(ctx)
}
