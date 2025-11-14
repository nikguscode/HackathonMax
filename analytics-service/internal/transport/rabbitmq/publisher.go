package rabbitmq

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/streadway/amqp"
)

// Publisher публикует сообщения в RabbitMQ с заданным exchange и routing key.
type Publisher struct {
	channel    *amqp.Channel // Канал RabbitMQ
	exchange   string        // Имя exchange
	routingKey string        // Routing key для публикации
}

// NewPublisher создаёт нового Publisher.
//
// Параметры:
//   - ch - канал RabbitMQ
//   - exchange - имя exchange, куда будут публиковаться сообщения
//   - routingKey - ключ маршрутизации сообщений
func NewPublisher(ch *amqp.Channel, exchange, routingKey string) *Publisher {
	return &Publisher{
		channel:    ch,
		exchange:   exchange,
		routingKey: routingKey,
	}
}

// PublishMetrics публикует отчёт (любую структуру) в RabbitMQ.
//
// Параметры:
//   - report - структура отчёта, которая будет сериализована в JSON.
//
// Возвращает ошибку, если не удалось сериализовать отчёт или отправить сообщение в очередь.
func (p *Publisher) PublishMetrics(report interface{}) error {
	body, err := json.Marshal(report)

	if err != nil {
		return fmt.Errorf("failed to marshal metrics: %w", err)
	}

	err = p.channel.Publish(
		p.exchange,
		p.routingKey,
		false, // mandatory
		false, // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)

	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	log.Printf("[Publisher] Sent report to queue '%s': %s", p.routingKey, string(body))
	return nil
}
