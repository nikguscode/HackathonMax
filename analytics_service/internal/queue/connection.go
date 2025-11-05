package queue

import (
	"log"

	"github.com/streadway/amqp"
)

func NewConnection() *amqp.Connection {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalf("Ошибка подключения к RabbitMQ: %v", err)
	}
	return conn
}
