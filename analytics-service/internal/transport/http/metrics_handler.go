package http

import (
	"analytics_service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MetricsHandler struct {
	svc *service.MetricsService
}

func NewMetricsHandler(svc *service.MetricsService) *MetricsHandler {
	return &MetricsHandler{svc: svc}
}

// GET /organizations/:organizationId/metrics?from=YYYY-MM-DD&to=YYYY-MM-DD
func (h *MetricsHandler) GetOrganizationMetrics(c *gin.Context) {
	orgID := c.Param("organizationId")
	from := c.Query("from")
	to := c.Query("to")

	cmd := service.MetricsCommand{
		Type:       "organization",
		ID:         orgID,
		ReportKind: "metrics",
		From:       from,
		To:         to,
	}

	report, err := h.svc.GenerateReport(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate metrics", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": report})
}

// GET /organizations/:organizationId/graphics?from=YYYY-MM-DD&to=YYYY-MM-DD
func (h *MetricsHandler) GetOrganizationGraphics(c *gin.Context) {
	orgID := c.Param("organizationId")
	from := c.Query("from")
	to := c.Query("to")

	cmd := service.MetricsCommand{
		Type:       "organization",
		ID:         orgID,
		ReportKind: "graphics",
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

// GET /queues/:queueId/metrics?from=YYYY-MM-DD&to=YYYY-MM-DD
func (h *MetricsHandler) GetQueueMetrics(c *gin.Context) {
	queueID := c.Param("queueId")
	from := c.Query("from")
	to := c.Query("to")

	cmd := service.MetricsCommand{
		Type:       "queue",
		ID:         queueID,
		ReportKind: "metrics",
		From:       from,
		To:         to,
	}

	report, err := h.svc.GenerateReport(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate metrics", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": report})
}

// GET /queues/:queueId/graphics?from=YYYY-MM-DD&to=YYYY-MM-DD
func (h *MetricsHandler) GetQueueGraphics(c *gin.Context) {
	queueID := c.Param("queueId")
	from := c.Query("from")
	to := c.Query("to")

	cmd := service.MetricsCommand{
		Type:       "queue",
		ID:         queueID,
		ReportKind: "graphics",
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
