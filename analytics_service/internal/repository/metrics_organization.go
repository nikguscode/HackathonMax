package repository

import (
	"analytics_service/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationMetricsRepository interface {
	NumberOfActiveQueues(orgID uuid.UUID) (int, error)
	NumberOfQueues(orgID uuid.UUID) (int, error)
	NumberOfMembersInAllQueues(orgID uuid.UUID) (int, error)
	NumberOfEmployees(orgID uuid.UUID) (int, error)
	AverageWaitingTimeOrg(orgID uuid.UUID) (float64, error)
	NumberOfServedMembersOrg(orgID uuid.UUID) (int, error)
}

type orgMetricsRepo struct {
	db *gorm.DB
}

func NewOrgMetricsRepo(db *gorm.DB) OrganizationMetricsRepository {
	return &orgMetricsRepo{db: db}
}

// Кол-во активных очередей
func (r *orgMetricsRepo) NumberOfActiveQueues(orgID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.Queue{}.TableName()).
		Where("organization_id = ? AND id IN (SELECT queue_id FROM "+model.QueueParams{}.TableName()+" WHERE is_active = true)", orgID).
		Count(&count).Error
	return int(count), err
}

// Кол-во всех очередей
func (r *orgMetricsRepo) NumberOfQueues(orgID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.Queue{}.TableName()).
		Where("organization_id = ?", orgID).
		Count(&count).Error
	return int(count), err
}

// Кол-во клиентов во всех очередях организации
func (r *orgMetricsRepo) NumberOfMembersInAllQueues(orgID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.QueueEntry{}.TableName()).
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = "+model.QueueEntry{}.TableName()+".queue_id").
		Where("q.organization_id = ?", orgID).
		Count(&count).Error
	return int(count), err
}

// Кол-во сотрудников организации
func (r *orgMetricsRepo) NumberOfEmployees(orgID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.UserRole{}.TableName()).
		Where("id_organization = ?", orgID).
		Count(&count).Error
	return int(count), err
}

// Среднее время ожидания по организации
func (r *orgMetricsRepo) AverageWaitingTimeOrg(orgID uuid.UUID) (float64, error) {
	var avg *float64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Select("AVG(EXTRACT(EPOCH FROM (em.arrived_at - em.joined_at)))").
		Joins("LEFT JOIN "+model.EntryMeta{}.TableName()+" em ON em.queue_entrie_id = qe.id").
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = qe.queue_id").
		Where("q.organization_id = ?", orgID).
		Scan(&avg).Error

	if avg != nil {
		return *avg, err
	}
	return 0, err
}

// Кол-во обслуженных клиентов по организации
func (r *orgMetricsRepo) NumberOfServedMembersOrg(orgID uuid.UUID) (int, error) {
	var count int64
	err := r.db.Table(model.QueueEntry{}.TableName()+" AS qe").
		Joins("JOIN "+model.Queue{}.TableName()+" q ON q.id = qe.queue_id").
		Where("q.organization_id = ? AND qe.status = 'served'", orgID).
		Count(&count).Error
	return int(count), err
}
