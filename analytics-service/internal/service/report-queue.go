package service

import (
	"analytics_service/internal/repository"
	"time"

	"github.com/google/uuid"
)

// NewQueueMetricsResponse создаёт объект ответа, содержащий метрики очереди.
func NewQueueMetricsResponse(metrics *QueueMetrics) QueueMetricsResponse {
	return QueueMetricsResponse{
		Metrics: metrics,
	}
}

// GenerateQueueReport формирует полный JSON-отчёт по очереди.
// Собирает данные из репозитория и агрегирует их в структуру QueueMetricsResponse.
//
// Параметры:
//   - repo — репозиторий для получения метрик очереди.
//   - queueID — строковый UUID очереди.
//
// Возвращает:
//   - сформированный отчёт QueueMetricsResponse
//   - ошибку, если парсинг UUID или выполнение запросов завершилось неуспешно.
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

// GenerateQueueGraphicsReport формирует графический отчёт по очереди
// за указанный период. В отчёте содержатся данные о среднем времени ожидания
// и количестве участников очереди по времени.
//
// Параметры:
//   - repo — репозиторий графических метрик очереди.
//   - queueID — строковый UUID очереди.
//   - from, to — временной диапазон.
//
// Возвращает:
//   - графический отчёт QueueGraphicsResponse
//   - ошибку при некорректном UUID или сбоях в запросах.
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
