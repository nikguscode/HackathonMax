package service

import (
	"analytics_service/internal/repository"

	"github.com/google/uuid"
)

// создаёт отчёт по организации
func NewOrganizationMetricsResponse(metrics *OrganizationMetrics) OrganizationMetricsResponse {
	return OrganizationMetricsResponse{
		Metrics: metrics,
	}
}

// формирует полный JSON-отчёт по организации
func GenerateOrganizationReport(repo repository.OrganizationMetricsRepository, orgID string) (OrganizationMetricsResponse, error) {
	oID, _ := uuid.Parse(orgID)

	activeQueues, _ := repo.NumberOfActiveQueues(oID)
	totalQueues, _ := repo.NumberOfQueues(oID)
	membersInAllQueues, _ := repo.NumberOfMembersInAllQueues(oID)
	numEmployees, _ := repo.NumberOfEmployees(oID)
	waitingTime, _ := repo.AverageWaitingTimeOrg(oID)
	servedMembers, _ := repo.NumberOfServedMembersOrg(oID)
	membersInDay, _ := repo.MembersInDay(oID)
	averageLoadInQueues, _ := repo.AverageLoadInQueues(oID)

	metrics := OrganizationMetrics{
		NumberOfActiveQueues:       &activeQueues,
		NumberOfQueues:             &totalQueues,
		NumberOfMembersInAllQueues: &membersInAllQueues,
		NumberOfEmployees:          &numEmployees,
		MembersInDay:               &membersInDay,
		WaitingTime:                &waitingTime,
		AverageLoadInQueues:        &averageLoadInQueues,
		NumberOfServedMembers:      &servedMembers,
	}

	report := NewOrganizationMetricsResponse(&metrics)

	return report, nil
}
