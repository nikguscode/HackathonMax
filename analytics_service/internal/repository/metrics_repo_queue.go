package repository

import (
	"analytics_service/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MetricsRepository interface {
	CountEntries(queueID uuid.UUID) (int, error)
	CountServedMembers(queueID uuid.UUID) (int, error)
	CountLeftMembers(queueID uuid.UUID) (int, error)
	AverageWaitingTime(queueID uuid.UUID) (float64, error)
	AverageServiceTime(queueID uuid.UUID) (float64, error)
}

type metricsRepo struct {
	db *gorm.DB
}

func NewMetricsRepo(db *gorm.DB) MetricsRepository {
	return &metricsRepo{db: db}
}

// Общее кол-во записей в очередь
func (r *metricsRepo) CountEntries(queueID uuid.UUID) (int, error) {
	var count int64
	if err := r.db.Model(&model.QueueEntry{}).
		Where("queue_id = ?", queueID).
		Count(&count).Error; err != nil {

		return 0, err
	}

	return int(count), nil

}

// Кол-во обслуженных
func (r *metricsRepo) CountServedMembers(queueID uuid.UUID) (int, error) {
	var count int64
	if err := r.db.Model(&model.QueueEntry{}).
		Where("queue_id = ? AND status = ?", queueID, "served").
		Count(&count).Error; err != nil {

		return 0, err
	}

	return int(count), nil
}

// Кол-во покинувших
func (r *metricsRepo) CountLeftMembers(queueID uuid.UUID) (int, error) {
	var count int64
	if err := r.db.Model(&model.QueueEntry{}).
		Where("queue_id = ? AND status = ?", queueID, "left").
		Count(&count).Error; err != nil {

		return 0, err
	}

	return int(count), nil
}

// Среднее время ожидания
func (r *metricsRepo) AverageWaitingTime(queueID uuid.UUID) (float64, error) {
	var avg *float64
	err := r.db.Table(`"queue_entrie" AS qe`).
		Select("AVG(EXTRACT(EPOCH FROM (em.arrived_at - em.joined_at)))").
		Joins("LEFT JOIN queue_entrie_meta em ON em.queue_entrie_id = qe.id").
		Where("qe.queue_id = ?", queueID).
		Scan(&avg).Error
	if err != nil {
		return 0, err
	}

	if avg != nil {
		return *avg, nil
	}
	return 0, nil
}

// Среднее время обслуживания
func (r *metricsRepo) AverageServiceTime(queueID uuid.UUID) (float64, error) {
	var avg *float64
	err := r.db.Table(`"queue_entrie" AS qe`).
		Select("AVG(EXTRACT(EPOCH FROM (em.arrived_at - em.joined_at)))").
		Joins("LEFT JOIN queue_entrie_meta em ON em.queue_entrie_id = qe.id").
		Where("qe.queue_id = ?", queueID).
		Scan(&avg).Error

	average := 0.0

	if avg != nil {
		average = *avg
	}

	return average, err

}
