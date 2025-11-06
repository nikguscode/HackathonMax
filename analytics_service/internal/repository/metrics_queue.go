package repository

import (
	"analytics_service/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QueueMetricsRepository interface {
	CountEntries(queueID uuid.UUID) (int, error)
	CountServedMembers(queueID uuid.UUID) (int, error)
	CountLeftMembers(queueID uuid.UUID) (int, error)
	AverageWaitingTime(queueID uuid.UUID) (float64, error)
	AverageServiceTime(queueID uuid.UUID) (float64, error)
}

type queueMetricsRepo struct {
	db *gorm.DB
}

func NewQueueMetricsRepo(db *gorm.DB) QueueMetricsRepository {
	return &queueMetricsRepo{db: db}
}

// Общее кол-во записей в очередь
func (r *queueMetricsRepo) CountEntries(queueID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Model(&model.QueueEntry{}).
		Where("queue_id = ?", queueID).
		Count(&count).Error
	return int(count), err
}

// Кол-во обслуженных
func (r *queueMetricsRepo) CountServedMembers(queueID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Model(&model.QueueEntry{}).
		Where("queue_id = ? AND status = ?", queueID, "served").
		Count(&count).Error
	return int(count), err
}

// Кол-во покинувших
func (r *queueMetricsRepo) CountLeftMembers(queueID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Model(&model.QueueEntry{}).
		Where("queue_id = ? AND status = ?", queueID, "left").
		Count(&count).Error
	return int(count), err
}

// Среднее время ожидания
func (r *queueMetricsRepo) AverageWaitingTime(queueID uuid.UUID) (float64, error) {
	var avg *float64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("AVG(EXTRACT(EPOCH FROM (em.arrived_at - em.joined_at)))").
		Joins("LEFT JOIN "+model.EntryMeta{}.TableName()+" em ON em.queue_entrie_id = qe.id").
		Where("qe.queue_id = ?", queueID).
		Scan(&avg).Error

	if avg != nil {
		return *avg, err
	}
	return 0, err
}

// Среднее время обслуживания
func (r *queueMetricsRepo) AverageServiceTime(queueID uuid.UUID) (float64, error) {
	var avg *float64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("AVG(EXTRACT(EPOCH FROM (em.finished_at - em.called_at)))").
		Joins("LEFT JOIN "+model.EntryMeta{}.TableName()+" em ON em.queue_entrie_id = qe.id").
		Where("qe.queue_id = ?", queueID).
		Scan(&avg).Error

	if avg != nil {
		return *avg, err
	}
	return 0, err
}
