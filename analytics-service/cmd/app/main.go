package main

import (
	"analytics_service/internal/app"
	"analytics_service/internal/bootstrap"
	"log"
)

func main() {
	log.Println("Starting application...")

	bs, err := bootstrap.Init()
	if err != nil {
		log.Fatalf("Bootstrap initialization failed: %v", err)
	}
	if bs.RabbitConn != nil {
		defer bs.RabbitConn.Close()
	}

	a := app.New(bs)
	if err := a.Run(); err != nil {
		log.Fatalf("Application failed: %v", err)
	}
}
