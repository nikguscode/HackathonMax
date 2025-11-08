package main

import (
	"analytics_service/internal/db"
	"analytics_service/internal/repository"
	"analytics_service/internal/service"
	"analytics_service/internal/transport/rabbitmq"
	"fmt"
	"log"
	"os"
)

func main() {
	log.Println("Start application...")

	conn, err := db.ConnectDB()
	if err != nil {
		log.Fatalf("DB connection failed: %v", err)
	}

	log.Println("DB connected seccessfully")

	repoQueue := repository.NewQueueMetricsRepo(conn)
	repoOrg := repository.NewOrgMetricsRepo(conn)

	metricsService := service.NewMetricsService(repoOrg, repoQueue)

	rabbitURL := fmt.Sprintf("amqp://%s:%s@45.135.135.32:5672",
		os.Getenv("RABBITMQ_DEFAULT_USER"),
		os.Getenv("RABBITMQ_DEFAULT_PASS"))

	fmt.Print(rabbitURL)

	rbconn, err := rabbitmq.NewConnection(rabbitURL)
	if err != nil {
		log.Fatal(err)
	}
	defer rbconn.Close()

	ch := rbconn.Channel()

	publisher := rabbitmq.NewPublisher(ch, "", "metrics_results")
	consumer := rabbitmq.NewConsumer(ch, "metrics_commands", metricsService, publisher)
	_ = consumer.Start()

	select {}
}
