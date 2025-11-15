package bootstrap

import (
	"analytics_service/internal/config"
	"analytics_service/internal/db"
	"analytics_service/internal/repository"
	"analytics_service/internal/service"
	"analytics_service/internal/transport/rabbitmq"

	"gorm.io/gorm"
)

// Bootstrap содержит все инициализированные зависимости приложения,
// включая конфигурацию, подключение к БД, сервисы и соединение RabbitMQ.
type Bootstrap struct {
	Config         *config.Config
	DBConn         *gorm.DB
	MetricsService *service.MetricsService
	RabbitConn     *rabbitmq.Connection
}

// Init инициализирует все зависимости приложения: загружает конфигурацию,
// подключается к базе данных, создаёт репозитории и сервисы,
// а также (при режиме rabbit) устанавливает соединение с RabbitMQ.
// Возвращает структуру Bootstrap, содержащую все готовые зависимости.
func Init() (*Bootstrap, error) {
	cfg := config.LoadConfig()

	conn, err := db.ConnectDB(cfg)
	if err != nil {
		return nil, err
	}

	repoQueue := repository.NewQueueMetricsRepo(conn)
	repoOrg := repository.NewOrgMetricsRepo(conn)
	graphQueue := repository.NewQueueGraphicsRepo(conn)
	graphOrg := repository.NewOrgGraphicsRepo(conn)

	metricsService := service.NewMetricsService(repoOrg, repoQueue, graphOrg, graphQueue)

	var rbconn *rabbitmq.Connection
	if cfg.AppMode == "rabbit" {
		rbconn, err = rabbitmq.NewConnection(cfg.RabbitURL())
		if err != nil {
			return nil, err
		}
	}

	return &Bootstrap{
		Config:         cfg,
		DBConn:         conn,
		MetricsService: metricsService,
		RabbitConn:     rbconn,
	}, nil
}
