package repository

import (
	"analytics_service/internal/model"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrgThroughput struct {
	Time       time.Time
	Throughput int
}

type OrgTotalLoad struct {
	Time      time.Time
	TotalLoad int
}

type OrganizationGraphicsRepository interface {
	ThroughputByTime(orgID uuid.UUID, from, to time.Time) ([]OrgThroughput, error)
	TotalLoadByTime(orgID uuid.UUID, from, to time.Time) ([]OrgTotalLoad, error)
}

type orgGraphicsRepo struct {
	db *gorm.DB
}

func NewOrgGraphicsRepo(db *gorm.DB) OrganizationGraphicsRepository {
	return &orgGraphicsRepo{db: db}
}

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
