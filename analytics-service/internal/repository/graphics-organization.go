package repository

import (
	"analytics_service/internal/model"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OrgThroughput представляет собой агрегированные данные
// о пропускной способности организации (количестве завершённых операций)
// за определённый временной интервал.
type OrgThroughput struct {
	Time       time.Time
	Throughput int
}

// OrgTotalLoad представляет собой агрегированную информацию
// о нагрузке (общем количестве активных записей) за час.
type OrgTotalLoad struct {
	Time      time.Time
	TotalLoad int
}

// OrganizationGraphicsRepository определяет интерфейс для получения
// агрегированной аналитики по организации: пропускной способности и нагрузке.
type OrganizationGraphicsRepository interface {
	// ThroughputByTime возвращает количество завершённых записей
	// по организации в разбивке по каждому часу в указанном диапазоне.
	ThroughputByTime(orgID uuid.UUID, from, to time.Time) ([]OrgThroughput, error)

	// TotalLoadByTime возвращает общее количество записей,
	// вошедших в очередь за каждый час в заданном интервале.
	TotalLoadByTime(orgID uuid.UUID, from, to time.Time) ([]OrgTotalLoad, error)
}

// orgGraphicsRepo - реализация OrganizationGraphicsRepository,
// использующая PostgreSQL через GORM.
type orgGraphicsRepo struct {
	db *gorm.DB
}

// NewOrgGraphicsRepo создаёт новый репозиторий для получения
// графической аналитики по организациям.
func NewOrgGraphicsRepo(db *gorm.DB) OrganizationGraphicsRepository {
	return &orgGraphicsRepo{db: db}
}

// ThroughputByTime выполняет запрос к БД и возвращает количество завершённых
// записей (finished_at) организации по часам в заданном диапазоне.
func (r *orgGraphicsRepo) ThroughputByTime(orgID uuid.UUID, from, to time.Time) ([]OrgThroughput, error) {
	var result []OrgThroughput

	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("DATE_TRUNC('hour', em.finished_at) AS time, COUNT(*) AS throughput").
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = qe.id_queue").
		Joins("JOIN "+model.EntryMeta{}.TableName()+" em ON em.id_queue_entry = qe.id").
		Where("q.id_organization = ? AND em.finished_at BETWEEN ? AND ?", orgID, from, to).
		Group("time").
		Order("time").
		Scan(&result).Error

	return result, err
}

// TotalLoadByTime выполняет запрос к БД и возвращает количество записей,
// вошедших в очередь (joined_at), сгруппированных по часам,
// в указанном временном интервале.
func (r *orgGraphicsRepo) TotalLoadByTime(orgID uuid.UUID, from, to time.Time) ([]OrgTotalLoad, error) {
	var result []OrgTotalLoad

	err := r.db.Raw(`
		SELECT DATE_TRUNC('hour', em.joined_at) AS time,
		       COUNT(qe.id) AS total_load
		FROM queue_entry qe
		JOIN queue q ON q.id = qe.id_queue
		JOIN queue_entry_meta em ON em.id_queue_entry = qe.id
		WHERE q.id_organization = ? AND em.joined_at BETWEEN ? AND ?
		GROUP BY time
		ORDER BY time
	`, orgID, from, to).Scan(&result).Error

	return result, err
}
