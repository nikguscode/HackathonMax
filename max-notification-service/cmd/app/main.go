package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"max-notification-service/internal/config"
	"max-notification-service/internal/service"
	"max-notification-service/internal/transport/max"
)

func main() {
	// Загрузка конфигурации
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Инициализация бота Max
	bot, err := max.NewBot(cfg.BotToken)
	if err != nil {
		log.Fatalf("Failed to create bot: %v", err)
	}

	// Создание сервисного слоя
	botService := service.NewBotService(bot)

	// Настройка graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Обработка сигналов для graceful shutdown
	go setupSignalHandler(cancel)

	// Запуск сервиса бота
	log.Println("Starting bot service...")
	if err := botService.Run(ctx); err != nil {
		log.Printf("Bot service stopped with error: %v", err)
	} else {
		log.Println("Bot service stopped gracefully")
	}
}

func setupSignalHandler(cancel context.CancelFunc) {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	sig := <-sigChan
	log.Printf("Received signal: %v", sig)
	cancel()
}
