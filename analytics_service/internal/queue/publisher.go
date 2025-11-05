package queue

import (
	"log"

	"github.com/streadway/amqp"
)

type Publisher struct {
	ch *amqp.Channel
}

func NewPublisher(conn *amqp.Connection) *Publisher {
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Ошибка при открытии канала: %v", err)
	}

	_, err = ch.QueueDeclare(
		"hello", // имя очереди
		true,    // durable (устойчивая) — сохраняется при перезапуске RabbitMQ
		false,   // auto-delete — не удаляется автоматически
		false,   // exclusive — не ограничена одним соединением
		false,   // no-wait — ждём подтверждения от брокера
		nil,     // аргументы (дополнительные настройки)
	)
	if err != nil {
		log.Fatalf("Ошибка при объявлении очереди: %v", err)
	}

	return &Publisher{ch: ch}
}

func (p *Publisher) Publish(body string) {
	err := p.ch.Publish(
		"",      // exchange (обменник) — "" означает использовать "прямую" очередь
		"hello", // routing key — имя очереди, куда отправляем сообщение
		false,   // mandatory — если очередь не найдена, сообщение теряется
		false,   // immediate — устаревший параметр (почти всегда false)
		amqp.Publishing{
			ContentType:  "text/plain",
			Body:         []byte(body),
			DeliveryMode: amqp.Persistent, // Persistent — сохраняется на диск (не исчезает при сбое)
		})
	if err != nil {
		log.Printf("Ошибка отправки сообщения: %v", err)
		return
	}

	log.Printf(" [x] Отправлено: %s", body)
}
