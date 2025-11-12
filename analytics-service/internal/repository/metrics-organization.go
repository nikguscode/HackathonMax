package repository

import (
	"analytics_service/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationMetricsRepository interface {
	NumberOfActiveQueues(IDorg uuid.UUID) (int, error)
	NumberOfQueues(IDorg uuid.UUID) (int, error)
	NumberOfMembersInAllQueues(IDorg uuid.UUID) (int, error)
	NumberOfEmployees(IDorg uuid.UUID) (int, error)
	AverageWaitingTimeOrg(IDorg uuid.UUID) (float32, error)
	NumberOfServedMembersOrg(IDorg uuid.UUID) (int, error)
	MembersInDay(IDorg uuid.UUID) (int, error)
	AverageLoadInQueues(IDorg uuid.UUID) (float32, error)
}

type orgMetricsRepo struct {
	db *gorm.DB
}

func NewOrgMetricsRepo(db *gorm.DB) OrganizationMetricsRepository {
	return &orgMetricsRepo{db: db}
}

// Кол-во активных очередей
func (r *orgMetricsRepo) NumberOfActiveQueues(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.Queue{}.TableName()).
		Where("id_organization = ? AND id IN (SELECT id_queue FROM "+model.QueueParams{}.TableName()+" WHERE is_active = true)", IDorg).
		Count(&count).Error
	return int(count), err
}

// Кол-во всех очередей
func (r *orgMetricsRepo) NumberOfQueues(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.Queue{}.TableName()).
		Where("id_organization = ?", IDorg).
		Count(&count).Error
	return int(count), err
}

// Кол-во клиентов во всех очередях организации
func (r *orgMetricsRepo) NumberOfMembersInAllQueues(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.QueueEntry{}.TableName()).
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = "+model.QueueEntry{}.TableName()+".id_queue").
		Where("q.id_organization = ?", IDorg).
		Count(&count).Error
	return int(count), err
}

// Кол-во сотрудников организации
func (r *orgMetricsRepo) NumberOfEmployees(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.UserRole{}.TableName()).
		Where("id_organization = ?", IDorg).
		Count(&count).Error
	return int(count), err
}

// Среднее время ожидания по организации
func (r *orgMetricsRepo) AverageWaitingTimeOrg(IDorg uuid.UUID) (float32, error) {
	var avg *float32
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("AVG(EXTRACT(EPOCH FROM (em.arrived_at - em.joined_at)))").
		Joins("LEFT JOIN "+model.EntryMeta{}.TableName()+" em ON em.id_queue_entry = qe.id").
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = qe.id_queue").
		Where("q.id_organization = ?", IDorg).
		Scan(&avg).Error

	if avg != nil {
		return *avg, err
	}
	return 0, err
}

// Кол-во обслуженных клиентов по организации
func (r *orgMetricsRepo) NumberOfServedMembersOrg(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = qe.id_queue").
		Where("q.id_organization = ? AND qe.status = 'SERVED'", IDorg).
		Count(&count).Error
	return int(count), err
}

// Кол-во клиентов, вошедших в очередь за текущие сутки
func (r *orgMetricsRepo) MembersInDay(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = qe.id_queue").
		Joins("JOIN "+model.EntryMeta{}.TableName()+" em ON em.id_queue_entry = qe.id").
		Where(`
			q.id_organization = ? 
			AND em.joined_at >= DATE_TRUNC('day', NOW()) 
			AND em.joined_at < DATE_TRUNC('day', NOW()) + INTERVAL '1 day'
		`, IDorg).
		Count(&count).Error
	return int(count), err
}

// Средняя загрузка очередей (отношение текущего размера к максимальному)
func (r *orgMetricsRepo) AverageLoadInQueues(IDorg uuid.UUID) (float32, error) {
	var avg *float32
	err := r.db.Raw(`
		SELECT 
			COALESCE(AVG(load_factor), 0) AS avg_load
		FROM (
			SELECT 
				q.id,
				CAST(COUNT(qe.id) AS float) / NULLIF(qp.max_queue_size, 0) AS load_factor
			FROM queue q
			LEFT JOIN queue_params qp ON qp.id_queue = q.id
			LEFT JOIN queue_entry qe ON qe.id_queue = q.id
			WHERE q.id_organization = ? AND qp.is_active = true
			GROUP BY q.id, qp.max_queue_size
		) sub;
	`, IDorg).Scan(&avg).Error

	if avg != nil {
		return *avg, err
	}
	return 0, err
}
