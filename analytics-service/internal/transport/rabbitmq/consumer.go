package rabbitmq

import (
	"analytics_service/internal/service"
	"encoding/json"
	"fmt"
	"log"

	"github.com/streadway/amqp"
)

// Consumer слушает очередь RabbitMQ и обрабатывает команды для генерации метрик.
type Consumer struct {
	channel   *amqp.Channel           // Канал RabbitMQ
	queueName string                  // Имя очереди для подписки
	service   *service.MetricsService // Сервис для генерации отчётов
	publisher *Publisher              // Публикатор для отправки результатов
}

// NewConsumer создаёт новый Consumer для указанной очереди.
//
// Параметры:
//   - ch - канал RabbitMQ
//   - queue - имя очереди для подписки
//   - svc - сервис для генерации отчётов
//   - pub - публикатор для отправки результатов
func NewConsumer(ch *amqp.Channel, queue string, svc *service.MetricsService, pub *Publisher) *Consumer {
	return &Consumer{
		channel:   ch,
		queueName: queue,
		service:   svc,
		publisher: pub,
	}
}

// Start начинает прослушивание очереди и обработку сообщений.
//
// Для каждого сообщения Consumer:
//  1. Десериализует MetricsCommand из JSON.
//  2. Генерирует отчёт через MetricsService.
//  3. Публикует результат через Publisher.
//
// Возвращает ошибку, если не удалось объявить очередь или подписаться на неё.
func (c *Consumer) Start() error {
	_, err := c.channel.QueueDeclare(
		c.queueName,
		true,  // durable
		false, // autoDelete
		false, // exclusive
		false, // noWait
		nil,   // args
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue: %w", err)
	}

	msgs, err := c.channel.Consume(
		c.queueName,
		"",    // consumer
		true,  // autoAck
		false, // exclusive
		false, // noLocal
		false, // noWait
		nil,   // args
	)
	if err != nil {
		return err
	}

	go func() {
		for msg := range msgs {
			var cmd service.MetricsCommand
			if err := json.Unmarshal(msg.Body, &cmd); err != nil {
				log.Printf("[Consumer] invalid message: %v", err)
				continue
			}

			report, err := c.service.GenerateReport(cmd)
			if err != nil {
				log.Printf("[Consumer] error: %v", err)
				continue
			}

			if err := c.publisher.PublishMetrics(report); err != nil {
				log.Printf("[Consumer] publish error: %v", err)
			}
		}
	}()

	return nil
}
