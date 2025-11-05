package main

import (
	"log"
	"time"

	"analytics_service/internal/queue"
)

func main() {
	conn := queue.NewConnection()
	defer conn.Close()

	// Создаём publisher и consumer
	pub := queue.NewPublisher(conn)
	con := queue.NewConsumer(conn)

	// Запускаем consumer в фоне
	con.Listen()

	// Периодически отправляем сообщения
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for t := range ticker.C {
		msg := "Сообщение от Go! " + t.Format("15:04:05")
		pub.Publish(msg)
		log.Println("Отправлено сообщение!")
	}
}
