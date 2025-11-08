package service

import (
	"analytics_service/internal/repository"

	"github.com/google/uuid"
)

// создаёт отчёт по очереди
func NewQueueMetricsResponse(metrics *QueueMetrics) QueueMetricsResponse {
	return QueueMetricsResponse{
		Metrics: metrics,
	}
}

// формирует полный JSON-отчёт по очереди
func GenerateQueueReport(repo repository.QueueMetricsRepository, queueID string) (QueueMetricsResponse, error) {

	qID, _ := uuid.Parse(queueID)

	totalEntries, _ := repo.CountEntries(qID)
	numberServed, _ := repo.CountServedMembers(qID)
	totalLeft, _ := repo.CountLeftMembers(qID)
	waitingTime, _ := repo.AverageWaitingTime(qID)
	serviceTime, _ := repo.AverageServiceTime(qID)

	metrics := QueueMetrics{
		WaitingTime:           &waitingTime,
		MembersInFragment:     nil,
		EntriesInTheQueue:     &totalEntries,
		NumberOfServedMembers: &numberServed,
		ServiceTime:           &serviceTime,
		TotalLeft:             &totalLeft,
		MaxInQueue:            nil,
		MinInQueue:            nil,
		AverageInQueue:        nil,
	}

	report := NewQueueMetricsResponse(&metrics)

	return report, nil
}
