package service

import (
	"analytics_service/internal/repository"
	"encoding/json"
	"fmt"
)

// сериализует любую структуру в JSON
func ToJSON(v any) ([]byte, error) {
	return json.Marshal(v)
}

// возвращает форматированный JSON
func PrettyJSON(v any) ([]byte, error) {
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return nil, err
	}
	return data, nil
}

type MetricsService struct {
	orgRepo   repository.OrganizationMetricsRepository
	queueRepo repository.QueueMetricsRepository
}

func NewMetricsService(
	orgRepo repository.OrganizationMetricsRepository,
	queueRepo repository.QueueMetricsRepository,
) *MetricsService {
	return &MetricsService{
		orgRepo:   orgRepo,
		queueRepo: queueRepo,
	}
}

type MetricsCommand struct {
	Type string `json:"type"`
	ID   string `json:"id"`
}

// какой отчет форматировать
func (s *MetricsService) GenerateReport(cmd MetricsCommand) (interface{}, error) {
	switch cmd.Type {
	case "queue":
		report, err := GenerateQueueReport(s.queueRepo, cmd.ID)
		if err != nil {
			return nil, fmt.Errorf("failed to generate queue report: %w", err)
		}
		return report, nil

	case "organization":
		report, err := GenerateOrganizationReport(s.orgRepo, cmd.ID)
		if err != nil {
			return nil, fmt.Errorf("failed to generate organization report: %w", err)
		}
		return report, err

	default:
		return nil, fmt.Errorf("unknown report type: %s", cmd.Type)
	}
}
