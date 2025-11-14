package repository

import (
	"analytics_service/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OrganizationMetricsRepository определяет набор метрик,
// вычисляемых для организации: активные очереди, общее количество очередей,
// клиенты, сотрудники, время ожидания и показатели нагрузки.
type OrganizationMetricsRepository interface {
	// NumberOfActiveQueues возвращает количество активных очередей организации.
	NumberOfActiveQueues(IDorg uuid.UUID) (int, error)

	// NumberOfQueues возвращает общее количество очередей организации.
	NumberOfQueues(IDorg uuid.UUID) (int, error)

	// NumberOfMembersInAllQueues возвращает количество клиентов,
	// находящихся во всех очередях организации.
	NumberOfMembersInAllQueues(IDorg uuid.UUID) (int, error)

	// NumberOfEmployees возвращает количество сотрудников организации.
	NumberOfEmployees(IDorg uuid.UUID) (int, error)

	// AverageWaitingTimeOrg вычисляет среднее время ожидания клиентов
	// по всем очередям организации.
	AverageWaitingTimeOrg(IDorg uuid.UUID) (float32, error)

	// NumberOfServedMembersOrg возвращает количество обслуженных клиентов.
	NumberOfServedMembersOrg(IDorg uuid.UUID) (int, error)

	// MembersInDay возвращает количество клиентов, вошедших в очередь за текущие сутки.
	MembersInDay(IDorg uuid.UUID) (int, error)

	// AverageLoadInQueues возвращает среднюю загрузку очередей
	// (отношение размера очереди к максимальному размеру).
	AverageLoadInQueues(IDorg uuid.UUID) (float32, error)
}

// orgMetricsRepo — реализация OrganizationMetricsRepository на GORM/Postgres.
type orgMetricsRepo struct {
	db *gorm.DB
}

// NewOrgMetricsRepo создаёт репозиторий для получения
// агрегированных метрик по организации.
func NewOrgMetricsRepo(db *gorm.DB) OrganizationMetricsRepository {
	return &orgMetricsRepo{db: db}
}

// NumberOfActiveQueues возвращает количество активных очередей организации.
// Активность определяется параметрами очереди (is_active = true).
func (r *orgMetricsRepo) NumberOfActiveQueues(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.Queue{}.TableName()).
		Where("id_organization = ? AND id IN (SELECT id_queue FROM "+model.QueueParams{}.TableName()+" WHERE is_active = true)", IDorg).
		Count(&count).Error
	return int(count), err
}

// NumberOfQueues возвращает общее количество очередей организации.
func (r *orgMetricsRepo) NumberOfQueues(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.Queue{}.TableName()).
		Where("id_organization = ?", IDorg).
		Count(&count).Error
	return int(count), err
}

// NumberOfMembersInAllQueues возвращает общее количество клиентов,
// находящихся во всех очередях организации.
func (r *orgMetricsRepo) NumberOfMembersInAllQueues(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.QueueEntry{}.TableName()).
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = "+model.QueueEntry{}.TableName()+".id_queue").
		Where("q.id_organization = ?", IDorg).
		Count(&count).Error
	return int(count), err
}

// NumberOfEmployees возвращает количество сотрудников организации.
func (r *orgMetricsRepo) NumberOfEmployees(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.UserRole{}.TableName()).
		Where("id_organization = ?", IDorg).
		Count(&count).Error
	return int(count), err
}

// AverageWaitingTimeOrg вычисляет среднее время ожидания клиентов
// по всем очередям организации (arrived_at - joined_at).
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

// NumberOfServedMembersOrg возвращает количество клиентов,
// которые были обслужены (status = 'SERVED') в организации.
func (r *orgMetricsRepo) NumberOfServedMembersOrg(IDorg uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = qe.id_queue").
		Where("q.id_organization = ? AND qe.status = 'SERVED'", IDorg).
		Count(&count).Error
	return int(count), err
}

// MembersInDay возвращает количество клиентов, вошедших в очередь
// за текущие сутки (по joined_at).
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

// AverageLoadInQueues возвращает среднюю загрузку очередей организации,
// рассчитываемую как count(queue_entry) / max_queue_size.
// Неактивные очереди игнорируются.
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
