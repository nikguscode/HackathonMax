package rabbitmq

import (
	"analytics_service/internal/service"
	"encoding/json"
	"log"

	"github.com/streadway/amqp"
)

type Consumer struct {
	channel   *amqp.Channel
	queueName string
	service   *service.MetricsService
	publisher *Publisher
}

func NewConsumer(ch *amqp.Channel, queue string, svc *service.MetricsService, pub *Publisher) *Consumer {
	return &Consumer{
		channel:   ch,
		queueName: queue,
		service:   svc,
		publisher: pub,
	}
}

func (c *Consumer) Start() error {
	msgs, err := c.channel.Consume(
		c.queueName,
		"",
		true,
		false,
		false,
		false,
		nil,
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
