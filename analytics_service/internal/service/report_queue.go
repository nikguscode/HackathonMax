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
	Organization OrganizationInfo `json:"organization"`
	Queue        QueueInfo        `json:"queue"`
	Metrics      MetricsQueue     `json:"metrics"`
}

// создаёт отчёт по очереди
func NewQueueReportJSON(orgID, orgName, queueID, queueName string, metrics MetricsQueue) QueueReportJSON {
	return QueueReportJSON{
		Organization: OrganizationInfo{
			ID:   orgID,
			Name: orgName,
		},
		Queue: QueueInfo{
			ID:   queueID,
			Name: queueName,
		},
		Metrics: metrics,
	}
}

// формирует полный JSON-отчёт по очереди
func GenerateQueueReport(repo repository.QueueMetricsRepository, orgID, orgName, queueID, queueName string) (QueueReportJSON, error) {

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

	report := NewQueueReportJSON(orgID, orgName, queueID, queueName, metrics)

	return report, nil
}
