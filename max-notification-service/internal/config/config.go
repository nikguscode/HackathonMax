package config

import (
	"log"
	"os"
)

type Config struct {
	BotToken   string
	HTTPAddr   string
	BackendURL string
}

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
