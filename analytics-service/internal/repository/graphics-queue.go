package repository

import (
	"analytics_service/internal/model"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// QueueWaitingTime представляет собой агрегированные данные
// о среднем времени ожидания клиентов в очереди за определённый час.
type QueueWaitingTime struct {
	Time        time.Time
	WaitingTime float32
}

// QueueMembersCount содержит агрегированную информацию
// о количестве участников очереди за каждый час.
type QueueMembersCount struct {
	Time  time.Time
	Count int
}

// QueueGraphicsRepository описывает интерфейс для получения
// аналитических данных по очереди — среднего времени ожидания
// и количества участников по часам.
type QueueGraphicsRepository interface {
	// AverageWaitingTimeByTime возвращает среднее время ожидания
	// клиентов в очереди, сгруппированное по часам в указанном интервале.
	AverageWaitingTimeByTime(queueID uuid.UUID, from, to time.Time) ([]QueueWaitingTime, error)

	// MembersInQueueByTime возвращает количество участников очереди,
	// сгруппированное по часам в указанном временном диапазоне.
	MembersInQueueByTime(queueID uuid.UUID, from, to time.Time) ([]QueueMembersCount, error)
}

// queueGraphicsRepo — реализация QueueGraphicsRepository
// на основе PostgreSQL через GORM.
type queueGraphicsRepo struct {
	db *gorm.DB
}

// NewQueueGraphicsRepo создаёт новый репозиторий для получения
// аналитики по очередям.
func NewQueueGraphicsRepo(db *gorm.DB) QueueGraphicsRepository {
	return &queueGraphicsRepo{db: db}
}

// AverageWaitingTimeByTime рассчитывает среднее время ожидания клиентов
// в очереди за каждый час указанного периода.
// Вычисляется разница между arrived_at и joined_at.
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

// MembersInQueueByTime возвращает количество записей, вошедших в очередь,
// сгруппированных по часу, в заданном временном диапазоне.
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
