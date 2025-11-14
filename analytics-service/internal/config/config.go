package config

import (
	"os"
)

// Config содержит все параметры конфигурации приложения,
// загружаемые из переменных окружения.
type Config struct {
	// AppMode определяет режим работы приложения: "rabbit" или "http".
	AppMode string

	RabbitUser string
	RabbitPass string
	RabbitHost string
	RabbitPort string

	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string

	HTTPPort string
}

// LoadConfig загружает конфигурацию приложения из переменных окружения
// и возвращает экземпляр структуры Config.
func LoadConfig() *Config {
	return &Config{
		AppMode: os.Getenv("APP_MODE"),

		RabbitUser: os.Getenv("RABBITMQ_DEFAULT_USER"),
		RabbitPass: os.Getenv("RABBITMQ_DEFAULT_PASS"),
		RabbitHost: os.Getenv("RABBIT_HOST"),
		RabbitPort: os.Getenv("RABBITMQ_PORT"),

		DBUser:     os.Getenv("POSTGRES_USER"),
		DBPassword: os.Getenv("POSTGRES_PASSWORD"),
		DBName:     os.Getenv("POSTGRES_DB"),
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("POSTGRES_PORT"),

		HTTPPort: os.Getenv("HTTP_PORT"),
	}
}

// RabbitURL формирует и возвращает строку подключения к RabbitMQ
// в формате amqp://user:pass@host:port.
func (c *Config) RabbitURL() string {
	return "amqp://" + c.RabbitUser + ":" + c.RabbitPass + "@" + c.RabbitHost + ":" + c.RabbitPort
}
