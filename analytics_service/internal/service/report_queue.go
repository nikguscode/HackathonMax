package service

import (
	"analytics_service/internal/repository"

	"github.com/google/uuid"
)

// метрики для очереди
type MetricsQueue struct {
	WaitingTime       int `json:"waiting_time"`
	MembersInFragment int `json:"members_in_fragment"`
	EntriesInQueue    int `json:"entries_in_the_queue"`
	NumberServed      int `json:"number_of_served_members"`
	ServiceTime       int `json:"service_time"`
	TotalLeft         int `json:"total_left"`
	MaxInQueue        int `json:"max_in_queue"`
	MinInQueue        int `json:"min_in_queue"`
	AverageInQueue    int `json:"average_in_queue"`
}

// структура JSON для очереди
type QueueReportJSON struct {
	Metrics MetricsQueue `json:"metrics"`
}

// создаёт отчёт по очереди
func NewQueueReportJSON(metrics MetricsQueue) QueueReportJSON {
	return QueueReportJSON{
		Metrics: metrics,
	}
}

// формирует полный JSON-отчёт по очереди
func GenerateQueueReport(repo repository.QueueMetricsRepository, queueID string) (QueueReportJSON, error) {

	qID, _ := uuid.Parse(queueID)

	totalEntries, _ := repo.CountEntries(qID)
	numberServed, _ := repo.CountServedMembers(qID)
	totalLeft, _ := repo.CountLeftMembers(qID)
	waitingTime, _ := repo.AverageWaitingTime(qID)
	serviceTime, _ := repo.AverageServiceTime(qID)

	metrics := MetricsQueue{
		WaitingTime:       int(waitingTime),
		MembersInFragment: 0,
		EntriesInQueue:    totalEntries,
		NumberServed:      numberServed,
		ServiceTime:       int(serviceTime),
		TotalLeft:         totalLeft,
		MaxInQueue:        0,
		MinInQueue:        0,
		AverageInQueue:    0,
	}

	report := NewQueueReportJSON(metrics)

	return report, nil
}
