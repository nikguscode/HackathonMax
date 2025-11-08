package app

import (
	"analytics_service/internal/bootstrap"
	"analytics_service/internal/service"
	"analytics_service/internal/transport/rabbitmq"
	"log"
)

type App struct {
	MetricsService *service.MetricsService
	RabbitConn     *rabbitmq.Connection
}

// New создает приложение на основе готовых зависимостей из bootstrap
func New(bs *bootstrap.Bootstrap) *App {
	return &App{
		MetricsService: bs.MetricsService,
		RabbitConn:     bs.RabbitConn,
	}
}

// Run стартует обработку очередей
func (a *App) Run() error {
	ch := a.RabbitConn.Channel()
	publisher := rabbitmq.NewPublisher(ch, "", "metrics_results")
	consumer := rabbitmq.NewConsumer(ch, "metrics_commands", a.MetricsService, publisher)

	if err := consumer.Start(); err != nil {
		return err
	}

	log.Println("Application started. Waiting for messages...")
	select {}
}
