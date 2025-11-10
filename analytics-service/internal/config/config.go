package config

import (
	"os"
)

type Config struct {
	RabbitUser string
	RabbitPass string
	RabbitHost string
	RabbitPort string

	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
}

func LoadConfig() *Config {
	return &Config{
		RabbitUser: os.Getenv("RABBITMQ_DEFAULT_USER"),
		RabbitPass: os.Getenv("RABBITMQ_DEFAULT_PASS"),
		RabbitHost: os.Getenv("RABBIT_HOST"),
		RabbitPort: os.Getenv("RABBITMQ_PORT"),

		DBUser:     os.Getenv("POSTGRES_USER"),
		DBPassword: os.Getenv("POSTGRES_PASSWORD"),
		DBName:     os.Getenv("POSTGRES_DB"),
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("POSTGRES_PORT"),
	}
}

func (c *Config) RabbitURL() string {
	return "amqp://" + c.RabbitUser + ":" + c.RabbitPass + "@" + c.RabbitHost + ":" + c.RabbitPort
}
