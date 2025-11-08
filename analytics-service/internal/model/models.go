package model

import (
	"time"

	"github.com/google/uuid"
)

// таблица "user"
type User struct {
	IDmax            uuid.UUID    `gorm:"column: id_max; type: uuid; primaryKey"`
	Username         string       `gorm:"size: 255; not null"`
	FirstName        string       `gorm:"size: 255; not null"`
	SecondName       string       `gorm:"size: 255; not null"`
	LastActivityTime time.Time    `gorm:"not null"`
	CreatedAt        time.Time    `gorm:"default:now()"`
	UserRoles        []UserRole   `gorm:"foreignKey: IDUser"`
	UserQueues       []UserQueue  `gorm:"foreignKey: IDUser"`
	QueueEntries     []QueueEntry `gorm:"foreignKey: IDUser"`
}

func (User) TableName() string {
	return `"user"`
}

// таблица "organization"
type Organization struct {
	ID          uuid.UUID `gorm:"type: uuid; primaryKey"`
	Name        string    `gorm:"size: 255; not null"`
	Description string
	Address     string
	IsBanned    bool       `gorm:"default:false"`
	CreatedAt   time.Time  `gorm:"default: now()"`
	UserRoles   []UserRole `gorm:"foreignKey:IDOrganization;references:ID"`
	Queues      []Queue    `gorm:"foreignKey:IDOrganization;references:ID"`
}

func (Organization) TableName() string {
	return `"organization"`
}

// таблица "user_role"
type UserRole struct {
	ID             uuid.UUID    `gorm:"type: uuid; primaryKey"`
	IDUser         uuid.UUID    `gorm:"type: uuid; not null"`
	IDOrganization uuid.UUID    `gorm:"type: uuid; not null"`
	Role           string       `gorm:"type: user_role; not null"`
	User           User         `gorm:"foreignKey: IDUser"`
	Organization   Organization `gorm:"foreignKey: IDOrganization"`
}

func (UserRole) TableName() string {
	return `"user_roles"`
}

// таблица "user_queue"
type UserQueue struct {
	ID      uuid.UUID `gorm:"type: uuid; primaryKey"`
	IDUser  uuid.UUID `gorm:"type: uuid; not null"`
	IDQueue uuid.UUID `gorm:"type: uuid; not null"`
	User    User      `gorm:"foreignKey: IDUser"`
	Queue   Queue     `gorm:"foreignKey: IDQueue"`
}

func (UserQueue) TableName() string {
	return `"user_queue"`
}

// таблица "queue"
type Queue struct {
	ID             uuid.UUID    `gorm:"type: uuid; primaryKey"`
	IDOrganization uuid.UUID    `gorm:"type: uuid; not null"`
	Name           string       `gorm:"size: 255; not null"`
	CreatedAt      time.Time    `gorm:"default: now()"`
	Organization   Organization `gorm:"foreignKey: IDOrganization"`
	Params         QueueParams  `gorm:"foreignKey: IDQueue"`
	Entries        []QueueEntry `gorm:"foreignKey: IDQueue"`
}

func (Queue) TableName() string {
	return `"queue"`
}

// таблица "queue_params"
type QueueParams struct {
	ID                 uuid.UUID `gorm:"type: uuid; primaryKey"`
	IDQueue            uuid.UUID `gorm:"column: id_queue; type: uuid; not null"`
	ArrivalGracePeriod int       `gorm:"deffault: 5"`
	MaxQueueSize       int       `gorm:"default: 100"`
	IsActive           bool      `gorm:"default: true"`
}

func (QueueParams) TableName() string {
	return `"queue_params"`
}

// таблица "queue_entrie"
type QueueEntry struct {
	ID      uuid.UUID   `gorm:"type: uuid; primaryKey"`
	IDQueue uuid.UUID   `gorm:"column: id_queue; type: uuid; not null"`
	IDUser  uuid.UUID   `gorm:"column: id_user; type: uuid; not null"`
	Status  string      `gorm:"type: queue_status; not null'"`
	Queue   Queue       `gorm:"foreignKey: IDQueue"`
	User    User        `gorm:"foreignKey: IDUser"`
	Meta    []EntryMeta `gorm:"foreignKey:IDQueueEntry;references:ID"`
}

func (QueueEntry) TableName() string {
	return `"queue_entry"`
}

// таблица "queue_entrie_meta"
type EntryMeta struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey"`
	QueueEntryID uuid.UUID  `gorm:"column:id_queue_entry;type:uuid;not null"`
	JoinedAt     *time.Time `gorm:"default:now()"`
	CalledAt     *time.Time
	ArrivedAt    *time.Time
	MissedAt     *time.Time
	StartedAt    *time.Time
	FinishedAt   *time.Time
	TimeLimit    *time.Time
}

func (EntryMeta) TableName() string {
	return `"queue_entry_meta"`
}
