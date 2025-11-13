package config

import "os"

type Config struct {
	BotToken string
	HTTPAddr string
}

func Load() Config {
	return Config{
		BotToken: os.Getenv("BOT_TOKEN"),
		HTTPAddr: ":8080",
	}
}
