package service

import (
	"context"
	"max-notification-service/internal/transport/maxbot"
)

// BotService представляет сервис для работы с ботом.
type BotService struct {
	bot *maxbot.Bot
}

// NewBotService создаёт новый экземпляр BotService.
//
// Параметры:
//   - bot: указатель на объект maxbot.Bot
//
// Возвращает:
//   - указатель на созданный BotService
func NewBotService(bot *maxbot.Bot) *BotService {
	return &BotService{bot: bot}
}

// Run запускает бота с использованием переданного контекста.
//
// Параметры:
//   - ctx: контекст для управления жизненным циклом бота
//
// Возвращает:
//   - ошибку, если запуск бота завершился неудачей
func (s *BotService) Run(ctx context.Context) error {
	return s.bot.Start(ctx)
}
