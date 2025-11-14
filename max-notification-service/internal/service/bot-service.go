package service

import (
	"context"
	"max-notification-service/internal/transport/maxbot"
)

type BotService struct {
	bot *maxbot.Bot
}

func NewBotService(bot *maxbot.Bot) *BotService {
	return &BotService{bot: bot}
}

func (s *BotService) Run(ctx context.Context) error {
	return s.bot.Start(ctx)
}
