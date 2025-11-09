package rabbitmq

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/streadway/amqp"
)

type Publisher struct {
	channel    *amqp.Channel
	exchange   string
	routingKey string
}

func NewPublisher(ch *amqp.Channel, exchange, routingKey string) *Publisher {
	return &Publisher{
		channel:    ch,
		exchange:   exchange,
		routingKey: routingKey,
	}
}

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
