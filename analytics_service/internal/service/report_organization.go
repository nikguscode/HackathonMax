package service

import (
	"analytics_service/internal/repository"

	"github.com/google/uuid"
)

// метрики для организации
type MetricsOrganization struct {
	NumberActiveQueues    int `json:"number_of_active_queues"`
	NumberOfQueues        int `json:"number_of_queues"`
	MembersInAllQueues    int `json:"number_of_members_in_all_queues"`
	NumberOfEmployees     int `json:"number_of_employees"`
	MembersInDay          int `json:"members_in_day"`
	WaitingTime           int `json:"waiting_time"`
	AverageLoadInQueues   int `json:"average_load_in_queues"`
	NumberOfServedMembers int `json:"number_of_served_members"`
}

// структура JSON для организации
type OrganizationReportJSON struct {
	Metrics MetricsOrganization `json:"metrics"`
}

// создаёт отчёт по организации
func NewOrganizationReportJSON(metrics MetricsOrganization) OrganizationReportJSON {
	return OrganizationReportJSON{
		Metrics: metrics,
	}
}

// формирует полный JSON-отчёт по организации
func GenerateOrganizationReport(repo repository.OrganizationMetricsRepository, orgID string) (OrganizationReportJSON, error) {
	oID, _ := uuid.Parse(orgID)

	activeQueues, _ := repo.NumberOfActiveQueues(oID)
	totalQueues, _ := repo.NumberOfQueues(oID)
	membersInAllQueues, _ := repo.NumberOfMembersInAllQueues(oID)
	numEmployees, _ := repo.NumberOfEmployees(oID)
	waitingTime, _ := repo.AverageWaitingTimeOrg(oID)
	servedMembers, _ := repo.NumberOfServedMembersOrg(oID)

	metrics := MetricsOrganization{
		NumberActiveQueues:    activeQueues,
		NumberOfQueues:        totalQueues,
		MembersInAllQueues:    membersInAllQueues,
		NumberOfEmployees:     numEmployees,
		MembersInDay:          0,
		WaitingTime:           int(waitingTime),
		AverageLoadInQueues:   0,
		NumberOfServedMembers: servedMembers,
	}

	report := NewOrganizationReportJSON(metrics)

	return report, nil
}
