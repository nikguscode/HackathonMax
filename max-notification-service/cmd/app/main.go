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
	cfg := config.Load()

	bot, err := maxTransport.NewBot(cfg.BotToken)
	if err != nil {
		log.Fatal(err)
	}

	notificationService := service.NewNotificationService(bot)

	bot.OnAnswer = notificationService.MemberAnswer

	httpSrv := httpTransport.NewServer(
		cfg.HTTPAddr,
		notificationService.StartNotify,
		notificationService.MemberAnswer,
	)

	go func() {
		if err := httpSrv.Start(); err != nil {
			log.Fatal("http server error:", err)
		}
	}()

	if err := bot.Start(context.Background()); err != nil {
		log.Fatal(err)
	}
}
