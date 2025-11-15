package app

import (
	"analytics_service/internal/bootstrap"
	apphttp "analytics_service/internal/transport/http"
	"analytics_service/internal/transport/rabbitmq"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

// App представляет собой основное приложение, управляющее запуском разных транспортов.
type App struct {
	bs *bootstrap.Bootstrap
}

// New создаёт новый экземпляр приложения.
func New(bs *bootstrap.Bootstrap) *App {
	return &App{bs: bs}
}

// Run запускает приложение в зависимости от режима работы,
// указанного в конфигурации (HTTP или RabbitMQ).
func (a *App) Run() error {
	switch a.bs.Config.AppMode {
	case "rabbit":
		return a.runRabbit()
	case "http":
		return a.runHTTP()
	default:
		return a.runRabbit()
	}
}

// runRabbit запускает приложение в режиме RabbitMQ.
// Инициализирует паблишер и консюмер и запускает обработку сообщений.
func (a *App) runRabbit() error {
	if a.bs.RabbitConn == nil {
		return fmt.Errorf("rabbit mode selected, but RabbitConn is nil")
	}

	ch := a.bs.RabbitConn.Channel()
	publisher := rabbitmq.NewPublisher(ch, "", "metrics_results")
	consumer := rabbitmq.NewConsumer(ch, "metrics_commands", a.bs.MetricsService, publisher)

	if err := consumer.Start(); err != nil {
		return err
	}

	log.Println("Application started in RABBITMQ mode. Waiting for messages...")
	select {}
}

// runHTTP запускает HTTP-сервер.
// Настраивает маршруты, запускает сервер и ожидает системный сигнал для корректного выключения.
func (a *App) runHTTP() error {
	port := 8080
	if a.bs.Config.HTTPPort != "" {
		fmt.Sscanf(a.bs.Config.HTTPPort, "%d", &port)
	}

	router := apphttp.NewRouter(a.bs.MetricsService)
	server := apphttp.NewServer(router, port)

	go func() {
		if err := server.Start(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	log.Printf("Application started in HTTP mode on :%d", port)

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	if err := server.Stop(context.Background()); err != nil {
		log.Fatalf("Failed to stop server: %v", err)
	}

	return nil
}
