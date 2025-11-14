package http

import (
	"analytics_service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// MetricsHandler обрабатывает HTTP-запросы для метрик и графиков организаций и очередей.
type MetricsHandler struct {
	svc *service.MetricsService
}

// NewMetricsHandler создаёт новый обработчик метрик с переданным сервисом.
func NewMetricsHandler(svc *service.MetricsService) *MetricsHandler {
	return &MetricsHandler{svc: svc}
}

// GetOrganizationMetrics обрабатывает GET-запрос для получения метрик организации.
//
// Путь: GET /organizations/:organizationId/metrics
// Параметры:
//   - organizationId — UUID организации в URL.
//
// Ответ:
//   - 200 OK с JSON, содержащим метрики организации.
//   - 500 Internal Server Error при ошибке генерации отчёта.
func (h *MetricsHandler) GetOrganizationMetrics(c *gin.Context) {
	orgID := c.Param("organizationId")

	cmd := service.MetricsCommand{
		Type:       "organization",
		ReportKind: "metrics",
		ID:         orgID,
	}

	report, err := h.svc.GenerateReport(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate metrics", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": report})
}

// GetOrganizationGraphics обрабатывает GET-запрос для получения графиков организации.
//
// Путь: GET /organizations/:organizationId/graphics
// Параметры URL:
//   - organizationId — UUID организации
//   - from — начальная дата (YYYY-MM-DD)
//   - to — конечная дата (YYYY-MM-DD)
//
// Ответ:
//   - 200 OK с JSON графиков организации.
//   - 400 Bad Request при отсутствии from/to.
//   - 500 Internal Server Error при ошибке генерации отчёта.
func (h *MetricsHandler) GetOrganizationGraphics(c *gin.Context) {
	orgID := c.Param("organizationId")
	from := c.Query("from")
	to := c.Query("to")

	if from == "" || to == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "from and to parameters are required"})
		return
	}

	cmd := service.MetricsCommand{
		Type:       "organization",
		ReportKind: "graphics",
		ID:         orgID,
		From:       from,
		To:         to,
	}

	report, err := h.svc.GenerateReport(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate graphics", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": report})
}

// GetQueueMetrics обрабатывает GET-запрос для получения метрик очереди.
//
// Путь: GET /queues/:queueId/metrics
// Параметры:
//   - queueId — UUID очереди
//
// Ответ:
//   - 200 OK с JSON метрик очереди.
//   - 500 Internal Server Error при ошибке генерации отчёта.
func (h *MetricsHandler) GetQueueMetrics(c *gin.Context) {
	queueID := c.Param("queueId")

	cmd := service.MetricsCommand{
		Type:       "queue",
		ReportKind: "metrics",
		ID:         queueID,
	}

	report, err := h.svc.GenerateReport(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate metrics", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": report})
}

// GetQueueGraphics обрабатывает GET-запрос для получения графиков очереди.
//
// Путь: GET /queues/:queueId/graphics
// Параметры URL:
//   - queueId — UUID очереди
//   - from — начальная дата (YYYY-MM-DD)
//   - to — конечная дата (YYYY-MM-DD)
//
// Ответ:
//   - 200 OK с JSON графиков очереди.
//   - 400 Bad Request при отсутствии from/to.
//   - 500 Internal Server Error при ошибке генерации отчёта.
func (h *MetricsHandler) GetQueueGraphics(c *gin.Context) {
	queueID := c.Param("queueId")
	from := c.Query("from")
	to := c.Query("to")

	if from == "" || to == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "from and to parameters are required"})
		return
	}

	cmd := service.MetricsCommand{
		Type:       "queue",
		ReportKind: "graphics",
		ID:         queueID,
		From:       from,
		To:         to,
	}

	report, err := h.svc.GenerateReport(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate graphics", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": report})
}
