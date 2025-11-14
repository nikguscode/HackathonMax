package service

import (
	"analytics_service/internal/repository"
	"encoding/json"
	"fmt"
	"time"
)

// ToJSON сериализует любую структуру в JSON.
func ToJSON(v any) ([]byte, error) {
	return json.Marshal(v)
}

// PrettyJSON возвращает форматированный JSON с отступами для удобного чтения.
func PrettyJSON(v any) ([]byte, error) {
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return nil, err
	}
	return data, nil
}

// MetricsService предоставляет методы для генерации отчётов
// и графиков для организаций и очередей.
type MetricsService struct {
	orgRepo    repository.OrganizationMetricsRepository
	queueRepo  repository.QueueMetricsRepository
	orgGraph   repository.OrganizationGraphicsRepository
	queueGraph repository.QueueGraphicsRepository
}

// NewMetricsService создаёт новый сервис для работы с метриками.
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

// MetricsCommand описывает команду для генерации отчёта или графика.
type MetricsCommand struct {
	Type       string `json:"type"`           // Тип сущности: "queue" или "organization"
	ReportKind string `json:"reportKind"`     // Вид отчёта: "metrics" или "graphics"
	ID         string `json:"id"`             // UUID очереди или организации
	From       string `json:"from,omitempty"` // Начальная дата для графиков (RFC3339)
	To         string `json:"to,omitempty"`   // Конечная дата для графиков (RFC3339)
}

// GenerateReport возвращает отчёт или график на основе команды MetricsCommand.
//
// В зависимости от Type ("queue"/"organization") и ReportKind ("metrics"/"graphics")
// вызывает соответствующие функции генерации отчёта.
//
// Возвращает:
//   - сгенерированный отчёт (структура или срез структур)
//   - ошибку, если тип или вид отчёта неизвестен, либо некорректные даты
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

// parseDates преобразует строки с датами в объекты time.Time.
//
// Ожидается формат RFC3339.
// Возвращает ошибку, если парсинг одной из дат не удался.
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
