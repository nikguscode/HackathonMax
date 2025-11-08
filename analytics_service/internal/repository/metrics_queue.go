package repository

import (
	"analytics_service/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QueueMetricsRepository interface {
	CountEntries(IDqueue uuid.UUID) (int, error)
	CountServedMembers(IDqueue uuid.UUID) (int, error)
	CountLeftMembers(IDqueue uuid.UUID) (int, error)
	AverageWaitingTime(IDqueue uuid.UUID) (float64, error)
	AverageServiceTime(IDqueue uuid.UUID) (float64, error)
}

type queueMetricsRepo struct {
	db *gorm.DB
}

func NewQueueMetricsRepo(db *gorm.DB) QueueMetricsRepository {
	return &queueMetricsRepo{db: db}
}

// Общее кол-во записей в очередь
func (r *queueMetricsRepo) CountEntries(IDqueue uuid.UUID) (int, error) {
	var count int64
	err := r.db.Model(&model.QueueEntry{}).
		Where("id_queue = ?", IDqueue).
		Count(&count).Error
	return int(count), err
}

// Кол-во обслуженных
func (r *queueMetricsRepo) CountServedMembers(IDqueue uuid.UUID) (int, error) {
	var count int64
	err := r.db.Model(&model.QueueEntry{}).
		Where("id_queue = ? AND status = ?", IDqueue, "SERVED").
		Count(&count).Error
	return int(count), err
}

// Кол-во покинувших
func (r *queueMetricsRepo) CountLeftMembers(IDqueue uuid.UUID) (int, error) {
	var count int64
	err := r.db.Model(&model.QueueEntry{}).
		Where("id_queue = ? AND status = ?", IDqueue, "CANCELED").
		Count(&count).Error
	return int(count), err
}

// Среднее время ожидания
func (r *queueMetricsRepo) AverageWaitingTime(IDqueue uuid.UUID) (float64, error) {
	var avg *float64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("AVG(EXTRACT(EPOCH FROM (em.arrived_at - em.joined_at)))").
		Joins("LEFT JOIN "+model.EntryMeta{}.TableName()+" em ON em.id_queue_entry = qe.id").
		Where("qe.id_queue = ?", IDqueue).
		Scan(&avg).Error

	if avg != nil {
		return *avg, err
	}
	return 0, err
}

// Среднее время обслуживания
func (r *queueMetricsRepo) AverageServiceTime(IDqueue uuid.UUID) (float64, error) {
	var avg *float64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("AVG(EXTRACT(EPOCH FROM (em.finished_at - em.called_at)))").
		Joins("LEFT JOIN "+model.EntryMeta{}.TableName()+" em ON em.id_queue_entry = qe.id").
		Where("qe.id_queue = ?", IDqueue).
		Scan(&avg).Error

	if avg != nil {
		return *avg, err
	}
	return 0, err
}
