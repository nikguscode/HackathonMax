package config

import (
	"fmt"
	"os"
)

type Config struct {
	BotToken string
}

func Load() (*Config, error) {
	token := os.Getenv("BOT_TOKEN")
	if token == "" {
		return nil, fmt.Errorf("BOT_TOKEN is null")
	}

	return &Config{
		BotToken: token,
	}, nil
}
