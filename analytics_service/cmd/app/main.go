package main

import (
	"analytics_service/internal/db"
	"analytics_service/internal/repository"

	"log"

	"github.com/google/uuid"
)

func main() {
	log.Println("Start application...")

	conn, err := db.ConnectDB()
	if err != nil {
		log.Fatalf("DB connection failed: %v", err)
	}

	log.Println("DB connected seccessfully")

	repo := repository.NewMetricsRepo(conn)

	queueTestId, _ := uuid.Parse("22222222-2222-2222-2222-222222222222")

	count, _ := repo.CountEntries(queueTestId)
	log.Println("Общее кол-во записей в очередь: ", count)

	count, _ = repo.CountServedMembers(queueTestId)
	log.Println("Кол-во обслуженных: ", count)

	count, _ = repo.CountLeftMembers(queueTestId)
	log.Println("Кол-во покинувших: ", count)

	ms, _ := repo.AverageWaitingTime(queueTestId)
	log.Println("Среднее время ожидания: ", ms)

	ms, _ = repo.AverageServiceTime(queueTestId)
	log.Println("Среднее время обслуживания: ", ms)
}
