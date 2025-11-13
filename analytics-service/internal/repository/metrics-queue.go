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
	AverageWaitingTime(IDqueue uuid.UUID) (float32, error)
	AverageServiceTime(IDqueue uuid.UUID) (float32, error)
	MaxInQueue(IDqueue uuid.UUID) (int, error)
	MinInQueue(IDqueue uuid.UUID) (int, error)
	AverageInQueue(IDqueue uuid.UUID) (int, error)
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
func (r *queueMetricsRepo) AverageWaitingTime(IDqueue uuid.UUID) (float32, error) {
	var avg *float32
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
func (r *queueMetricsRepo) AverageServiceTime(IDqueue uuid.UUID) (float32, error) {
	var avg *float32
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

// Максимум в очереди
func (r *queueMetricsRepo) MaxInQueue(IDqueue uuid.UUID) (int, error) {
	var max int
	err := r.db.Raw(`
		WITH intervals AS (
			SELECT 
				em.joined_at AS start_time,
				COALESCE(em.called_at, em.missed_at, em.finished_at, NOW()) AS end_time
			FROM queue_entry qe
			JOIN queue_entry_meta em ON em.id_queue_entry = qe.id
			WHERE qe.id_queue = ?
		),
		events AS (
			SELECT start_time AS t, 1 AS delta FROM intervals
			UNION ALL
			SELECT end_time AS t, -1 AS delta FROM intervals
		),
		accum AS (
			SELECT t, SUM(delta) OVER (ORDER BY t) AS active_count
			FROM events
		)
		SELECT MAX(active_count) FROM accum;
	`, IDqueue).Scan(&max).Error
	return max, err
}

// Минимум в очереди
func (r *queueMetricsRepo) MinInQueue(IDqueue uuid.UUID) (int, error) {
	var min int
	err := r.db.Raw(`
		WITH intervals AS (
			SELECT 
				em.joined_at AS start_time,
				COALESCE(em.called_at, em.missed_at, em.finished_at, NOW()) AS end_time
			FROM queue_entry qe
			JOIN queue_entry_meta em ON em.id_queue_entry = qe.id
			WHERE qe.id_queue = ?
		),
		events AS (
			SELECT start_time AS t, 1 AS delta FROM intervals
			UNION ALL
			SELECT end_time AS t, -1 AS delta FROM intervals
		),
		accum AS (
			SELECT t, SUM(delta) OVER (ORDER BY t) AS active_count
			FROM events
		)
		SELECT MIN(active_count) FROM accum WHERE active_count > 0;
	`, IDqueue).Scan(&min).Error
	return min, err
}

// Среднее количество людей в очереди
func (r *queueMetricsRepo) AverageInQueue(IDqueue uuid.UUID) (int, error) {
	var avg float32
	err := r.db.Raw(`
		WITH intervals AS (
			SELECT 
				em.joined_at AS start_time,
				COALESCE(em.called_at, em.missed_at, em.finished_at, NOW()) AS end_time
			FROM queue_entry qe
			JOIN queue_entry_meta em ON em.id_queue_entry = qe.id
			WHERE qe.id_queue = ?
		),
		events AS (
			SELECT start_time AS t, 1 AS delta FROM intervals
			UNION ALL
			SELECT end_time AS t, -1 AS delta FROM intervals
		),
		accum AS (
			SELECT t, SUM(delta) OVER (ORDER BY t) AS active_count
			FROM events
		),
		duration AS (
			SELECT active_count,
				   LEAD(t) OVER (ORDER BY t) AS next_t,
				   t
			FROM accum
		)
		SELECT 
			COALESCE(SUM(EXTRACT(EPOCH FROM (next_t - t)) * active_count) /
					 NULLIF(SUM(EXTRACT(EPOCH FROM (next_t - t))), 0), 0)
		FROM duration;
	`, IDqueue).Scan(&avg).Error
	return int(avg), err
}
