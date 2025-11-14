package http

import (
	"analytics_service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// NewRouter создаёт и настраивает HTTP-маршруты для приложения.
//
// Параметры:
//   - metricsService — сервис для работы с метриками и графиками.
//
// Возвращает:
//   - настроенный Gin Engine с зарегистрированными маршрутами.
func NewRouter(metricsService *service.MetricsService) *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	handler := NewMetricsHandler(metricsService)

	r.GET("/organizations/:organizationId/metrics", handler.GetOrganizationMetrics)
	r.GET("/organizations/:organizationId/graphics", handler.GetOrganizationGraphics)

	r.GET("/queues/:queueId/metrics", handler.GetQueueMetrics)
	r.GET("/queues/:queueId/graphics", handler.GetQueueGraphics)

	return r
}
