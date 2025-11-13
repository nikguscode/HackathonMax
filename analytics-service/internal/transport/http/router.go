package http

import (
	"analytics_service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewRouter(metricsService *service.MetricsService) *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	api := r.Group("/api/v1")
	{
		metricsHandler := NewMetricsHandler(metricsService)
		api.POST("/metrics", metricsHandler.GenerateReport)
	}

	return r
}
