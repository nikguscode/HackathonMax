package service

import (
	"analytics_service/internal/repository"
	"time"

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

func GenerateQueueGraphicsReport(repo repository.QueueGraphicsRepository, queueID string, from, to time.Time) (QueueGraphicsResponse, error) {
	qID, _ := uuid.Parse(queueID)

	waitingTimes, _ := repo.AverageWaitingTimeByTime(qID, from, to)
	membersCounts, _ := repo.MembersInQueueByTime(qID, from, to)

	// Преобразуем в OpenAPI DTO
	wt := make([]struct {
		Time        *time.Time `json:"time,omitempty"`
		WaitingTime *float32   `json:"waitingTime,omitempty"`
	}, len(waitingTimes))
	for i, v := range waitingTimes {
		wt[i] = struct {
			Time        *time.Time `json:"time,omitempty"`
			WaitingTime *float32   `json:"waitingTime,omitempty"`
		}{Time: &v.Time, WaitingTime: &v.WaitingTime}
	}

	mc := make([]struct {
		Count *int       `json:"count,omitempty"`
		Time  *time.Time `json:"time,omitempty"`
	}, len(membersCounts))
	for i, v := range membersCounts {
		mc[i] = struct {
			Count *int       `json:"count,omitempty"`
			Time  *time.Time `json:"time,omitempty"`
		}{Count: &v.Count, Time: &v.Time}
	}

	return QueueGraphicsResponse{
		Graphics: &QueueGraphics{
			AverageWaitingTimeByTime: &wt,
			MembersInQueueByTime:     &mc,
		},
	}, nil
}
