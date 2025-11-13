package main

import (
	"context"
	"log"

	"max-notification-service/internal/config"
	"max-notification-service/internal/service"
	httpTransport "max-notification-service/internal/transport/http"
	maxTransport "max-notification-service/internal/transport/maxbot"
)

func main() {
	// 1. Загружаем конфиг (если не нужен – пропусти)
	cfg := config.Load()

	// 2. Создаём MAX-бота
	bot, err := maxTransport.NewBot(cfg.BotToken)
	if err != nil {
		log.Fatal("cannot start bot:", err)
	}

	// 3. Сервис, который соединяет HTTP ↔ бот
	notificationService := service.NewNotificationService(bot)

	// 4. HTTP-сервер
	httpSrv := httpTransport.NewServer(
		cfg.HTTPAddr,                     // например ":8080"
		notificationService.StartNotify,  // вызывается при /notify
		notificationService.MemberAnswer, // вызывается при /callback
	)

	// 5. Запускаем HTTP сервер
	go func() {
		if err := httpSrv.Start(); err != nil {
			log.Fatal("http server error:", err)
		}
	}()

	// 6. Запускаем бота (блокирующий вызов)
	if err := bot.Start(context.Background()); err != nil {
		log.Fatal("bot stopped:", err)
	}
}
