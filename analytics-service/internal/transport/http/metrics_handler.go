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

// GET /organizations/:organizationId/metrics
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

// GET /organizations/:organizationId/graphics?from=YYYY-MM-DD&to=YYYY-MM-DD
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

// GET /queues/:queueId/metrics
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

// GET /queues/:queueId/graphics?from=YYYY-MM-DD&to=YYYY-MM-DD
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
