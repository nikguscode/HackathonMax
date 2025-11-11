package repository

import (
	"analytics_service/internal/model"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// простые структуры для репозитория
type QueueWaitingTime struct {
	Time        time.Time
	WaitingTime float32
}

type QueueMembersCount struct {
	Time  time.Time
	Count int
}

type QueueGraphicsRepository interface {
	AverageWaitingTimeByTime(queueID uuid.UUID, from, to time.Time) ([]QueueWaitingTime, error)
	MembersInQueueByTime(queueID uuid.UUID, from, to time.Time) ([]QueueMembersCount, error)
}

type queueGraphicsRepo struct {
	db *gorm.DB
}

func NewQueueGraphicsRepo(db *gorm.DB) QueueGraphicsRepository {
	return &queueGraphicsRepo{db: db}
}

// Среднее время ожидания по времени
func (r *queueGraphicsRepo) AverageWaitingTimeByTime(queueID uuid.UUID, from, to time.Time) ([]QueueWaitingTime, error) {
	var result []QueueWaitingTime

	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("DATE_TRUNC('hour', em.joined_at) AS time, AVG(EXTRACT(EPOCH FROM (em.arrived_at - em.joined_at))) AS waiting_time").
		Joins("JOIN "+model.EntryMeta{}.TableName()+" em ON em.id_queue_entry = qe.id").
		Where("qe.id_queue = ? AND em.joined_at BETWEEN ? AND ?", queueID, from, to).
		Group("time").
		Order("time").
		Scan(&result).Error

	return result, err
}

// Кол-во участников в очереди по времени
func (r *queueGraphicsRepo) MembersInQueueByTime(queueID uuid.UUID, from, to time.Time) ([]QueueMembersCount, error) {
	var result []QueueMembersCount

	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("DATE_TRUNC('hour', em.joined_at) AS time, COUNT(*) AS count").
		Joins("JOIN "+model.EntryMeta{}.TableName()+" em ON em.id_queue_entry = qe.id").
		Where("qe.id_queue = ? AND em.joined_at BETWEEN ? AND ?", queueID, from, to).
		Group("time").
		Order("time").
		Scan(&result).Error

	return result, err
}
