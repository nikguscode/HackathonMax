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
	max, _ := repo.MaxInQueue(qID)
	min, _ := repo.MinInQueue(qID)
	avg, _ := repo.AverageInQueue(qID)

	metrics := QueueMetrics{
		WaitingTime:           &waitingTime,
		EntriesInTheQueue:     &totalEntries,
		NumberOfServedMembers: &numberServed,
		ServiceTime:           &serviceTime,
		TotalLeft:             &totalLeft,
		MaxInQueue:            &max,
		MinInQueue:            &min,
		AverageInQueue:        &avg,
	}

	report := NewQueueMetricsResponse(&metrics)

	return report, nil
}
