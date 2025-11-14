package rabbitmq

import (
	"fmt"

	"github.com/streadway/amqp"
)

// Connection оборачивает соединение и канал RabbitMQ для удобства работы.
type Connection struct {
	conn    *amqp.Connection // Соединение с RabbitMQ
	channel *amqp.Channel    // Канал для публикации и потребления сообщений
}

// Channel возвращает канал RabbitMQ для публикации или потребления сообщений.
func (r *Connection) Channel() *amqp.Channel {
	return r.channel
}

// NewConnection создаёт новое соединение с RabbitMQ и открывает канал.
//
// Параметры:
//   - url - URL подключения к RabbitMQ (например, amqp://user:pass@host:port)
//
// Возвращает:
//   - указатель на Connection
//   - ошибку, если не удалось соединиться или открыть канал
func NewConnection(url string) (*Connection, error) {
	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, fmt.Errorf("failed to connection to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		conn.Close()
		return nil, fmt.Errorf("failed to open channel: %w", err)
	}

	return &Connection{
		conn:    conn,
		channel: ch,
	}, nil
}

// Close корректно закрывает канал и соединение RabbitMQ.
func (c *Connection) Close() {
	if c.channel != nil {
		_ = c.channel.Close()
	}
	if c.conn != nil {
		_ = c.conn.Close()
	}
}
