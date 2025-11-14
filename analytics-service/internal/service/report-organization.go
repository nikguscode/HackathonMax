package service

import (
	"analytics_service/internal/repository"
	"time"

	"github.com/google/uuid"
)

// NewOrganizationMetricsResponse создаёт объект ответа,
// содержащий метрики организации.
func NewOrganizationMetricsResponse(metrics *OrganizationMetrics) OrganizationMetricsResponse {
	return OrganizationMetricsResponse{
		Metrics: metrics,
	}
}

// GenerateOrganizationReport формирует полный JSON-отчёт по метрикам организации.
// Собирает данные из репозитория и агрегирует их в структуру OrganizationMetricsResponse.
//
// Параметры:
//   - repo — репозиторий для получения метрик организации.
//   - orgID — строковый UUID организации.
//
// Возвращает:
//   - сформированный отчёт OrganizationMetricsResponse
//   - ошибку, если парсинг UUID или выполнение запросов завершилось неуспешно.
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

// GenerateOrganizationGraphicsReport формирует графический отчёт по организации
// за указанный период. В отчёте содержатся данные о пропускной способности
// и суммарной нагрузке по временным интервалам.
//
// Параметры:
//   - repo — репозиторий графических метрик организации.
//   - orgID — строковый UUID организации.
//   - from, to — временной диапазон.
//
// Возвращает:
//   - графический отчёт OrganizationGraphicsResponse
//   - ошибку при некорректном UUID или сбоях в запросах.
func GenerateOrganizationGraphicsReport(repo repository.OrganizationGraphicsRepository, orgID string, from, to time.Time) (OrganizationGraphicsResponse, error) {
	oID, _ := uuid.Parse(orgID)

	throughput, _ := repo.ThroughputByTime(oID, from, to)
	totalLoad, _ := repo.TotalLoadByTime(oID, from, to)

	tp := make([]struct {
		Throughput *int       `json:"throughput,omitempty"`
		Time       *time.Time `json:"time,omitempty"`
	}, len(throughput))
	for i, v := range throughput {
		tp[i] = struct {
			Throughput *int       `json:"throughput,omitempty"`
			Time       *time.Time `json:"time,omitempty"`
		}{Throughput: &v.Throughput, Time: &v.Time}
	}

	tl := make([]struct {
		Time      *time.Time `json:"time,omitempty"`
		TotalLoad *int       `json:"totalLoad,omitempty"`
	}, len(totalLoad))
	for i, v := range totalLoad {
		tl[i] = struct {
			Time      *time.Time `json:"time,omitempty"`
			TotalLoad *int       `json:"totalLoad,omitempty"`
		}{Time: &v.Time, TotalLoad: &v.TotalLoad}
	}

	return OrganizationGraphicsResponse{
		Graphics: &OrganizationGraphics{
			ThroughputByTime: &tp,
			TotalLoadByTime:  &tl,
		},
	}, nil
}
