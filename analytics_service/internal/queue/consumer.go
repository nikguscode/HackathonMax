package queue

import (
	"log"

	"github.com/streadway/amqp"
)

type Consumer struct {
	ch *amqp.Channel
}

func NewConsumer(conn *amqp.Connection) *Consumer {
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Ошибка при открытии канала: %v", err)
	}

	_, err = ch.QueueDeclare(
		"hello",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Ошибка при объявлении очереди: %v", err)
	}

	return &Consumer{ch: ch}
}

func (c *Consumer) Listen() {
	msgs, err := c.ch.Consume(
		"hello",
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Ошибка при подписке: %v", err)
	}

	go func() {
		for d := range msgs {
			log.Printf(" [x] Получено: %s", d.Body)
		}
	}()
}
