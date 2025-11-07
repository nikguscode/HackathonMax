package main

import (
	"analytics_service/internal/db"
	"analytics_service/internal/repository"
	"analytics_service/internal/service"

	"log"
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

	reportQueue, err := service.GenerateQueueReport(repoQueue, "11111111-1111-1111-1111-111111111111", "Test Org", "22222222-2222-2222-2222-222222222222", "Main Queue")

	reportOrg, err := service.GenerateOrganizationReport(repoOrg, "11111111-1111-1111-1111-111111111111", "Test Org")

	prettyQueue, err := service.PrettyJSON(reportQueue)
	prettyOrg, err := service.PrettyJSON(reportOrg)

	log.Printf("%s\n", prettyQueue)
	log.Printf("%s\n", prettyOrg)

}
