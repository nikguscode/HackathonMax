package config

import (
	"log"
	"os"
)

// Config представляет конфигурацию приложения.
type Config struct {
	// BotToken содержит токен для бота.
	BotToken string

	// HTTPAddr содержит адрес и порт HTTP сервера.
	HTTPAddr string

	// BackendURL содержит адрес и порт backend сервиса.
	BackendURL string
}

// Load загружает конфигурацию из переменных окружения.
//
// Переменные окружения:
//   - HTTP_PORT: порт HTTP сервера (обязательная, иначе программа завершится с ошибкой)
//   - POST_HOST: адрес backend сервиса
//   - POST_PORT: порт backend сервиса
//   - MAX_BOT_TOKEN: токен бота
//
// Возвращает структуру Config с заполненными полями.
func Load() Config {
	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		log.Fatal("Fail read port")
	}
	httpAddr := ":" + httpPort

	backendURL := os.Getenv("POST_HOST") + ":" + os.Getenv("POST_PORT")

	return Config{
		BotToken:   os.Getenv("MAX_BOT_TOKEN"),
		HTTPAddr:   httpAddr,
		BackendURL: backendURL,
	}
}
