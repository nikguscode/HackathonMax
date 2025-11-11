package service

import (
	"analytics_service/internal/repository"
	"encoding/json"
	"fmt"
	"time"
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
	orgRepo    repository.OrganizationMetricsRepository
	queueRepo  repository.QueueMetricsRepository
	orgGraph   repository.OrganizationGraphicsRepository
	queueGraph repository.QueueGraphicsRepository
}

func NewMetricsService(
	orgRepo repository.OrganizationMetricsRepository,
	queueRepo repository.QueueMetricsRepository,
	orgGraph repository.OrganizationGraphicsRepository,
	queueGraph repository.QueueGraphicsRepository,
) *MetricsService {
	return &MetricsService{
		orgRepo:    orgRepo,
		queueRepo:  queueRepo,
		orgGraph:   orgGraph,
		queueGraph: queueGraph,
	}
}

type MetricsCommand struct {
	Type       string `json:"type"`       // "queue" или "organization"
	ReportKind string `json:"reportKind"` // "metrics" или "graphics"
	ID         string `json:"id"`
	From       string `json:"from,omitempty"` // для графиков: начальная дата
	To         string `json:"to,omitempty"`   // для графиков: конечная дата
}

// какой отчет форматировать
func (s *MetricsService) GenerateReport(cmd MetricsCommand) (interface{}, error) {
	switch cmd.Type {
	case "queue":
		switch cmd.ReportKind {
		case "metrics":
			return GenerateQueueReport(s.queueRepo, cmd.ID)
		case "graphics":
			from, to, err := parseDates(cmd.From, cmd.To)
			if err != nil {
				return nil, err
			}
			return GenerateQueueGraphicsReport(s.queueGraph, cmd.ID, from, to)
		default:
			return nil, fmt.Errorf("unknown report kind: %s", cmd.ReportKind)
		}

	case "organization":
		switch cmd.ReportKind {
		case "metrics":
			return GenerateOrganizationReport(s.orgRepo, cmd.ID)
		case "graphics":
			from, to, err := parseDates(cmd.From, cmd.To)
			if err != nil {
				return nil, err
			}
			return GenerateOrganizationGraphicsReport(s.orgGraph, cmd.ID, from, to)
		default:
			return nil, fmt.Errorf("unknown report kind: %s", cmd.ReportKind)
		}

	default:
		return nil, fmt.Errorf("unknown report type: %s", cmd.Type)
	}
}

func parseDates(fromStr, toStr string) (time.Time, time.Time, error) {
	from, err := time.Parse(time.RFC3339, fromStr)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("invalid from date: %w", err)
	}
	to, err := time.Parse(time.RFC3339, toStr)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("invalid to date: %w", err)
	}
	return from, to, nil
}
