package model

import (
	"time"

	"github.com/google/uuid"
)

// таблица "user"
type User struct {
	IDmax        int64        `gorm:"column:id_max;primaryKey"`
	Username     string       `gorm:"size:255;not null"`
	FirstName    string       `gorm:"size:255;not null"`
	SecondName   string       `gorm:"size:255;not null"`
	CreatedAt    time.Time    `gorm:"column:created_at;not null;default:now()"`
	UserRoles    []UserRole   `gorm:"foreignKey:IDmax"`
	UserQueues   []UserQueue  `gorm:"foreignKey:IDmax"`
	QueueEntries []QueueEntry `gorm:"foreignKey:IDmax"`
}

func (User) TableName() string {
	return `"user"`
}

// таблица "organization"
type Organization struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey"`
	Name        string     `gorm:"size:255;not null"`
	Description string     `gorm:"type:text;not null"`
	Address     string     `gorm:"type:text;not null"`
	IsBanned    bool       `gorm:"not null;default:false"`
	CreatedAt   time.Time  `gorm:"not null;default:now()"`
	UserRoles   []UserRole `gorm:"foreignKey:IDOrganization;references:ID"`
	Queues      []Queue    `gorm:"foreignKey:IDOrganization;references:ID"`
}

func (Organization) TableName() string {
	return `"organization"`
}

// таблица "user_roles"
type UserRole struct {
	ID             uuid.UUID    `gorm:"type:uuid;primaryKey"`
	IDmax          int64        `gorm:"column:id_max;not null"`
	IDOrganization uuid.UUID    `gorm:"type:uuid;not null"`
	Role           string       `gorm:"type:user_role;not null"`
	User           User         `gorm:"foreignKey:IDmax"`
	Organization   Organization `gorm:"foreignKey:IDOrganization"`
}

func (UserRole) TableName() string {
	return `"user_roles"`
}

// таблица "user_queue"
type UserQueue struct {
	ID      uuid.UUID `gorm:"type:uuid;primaryKey"`
	IDmax   int64     `gorm:"column:id_max;not null"`
	IDQueue uuid.UUID `gorm:"type:uuid;not null"`
	User    User      `gorm:"foreignKey:IDmax"`
	Queue   Queue     `gorm:"foreignKey:IDQueue"`
}

func (UserQueue) TableName() string {
	return `"user_queue"`
}

// таблица "queue"
type Queue struct {
	ID             uuid.UUID    `gorm:"type:uuid;primaryKey"`
	IDOrganization uuid.UUID    `gorm:"type:uuid;not null"`
	Name           string       `gorm:"size:255;not null"`
	CreatedAt      time.Time    `gorm:"not null;default:now()"`
	Organization   Organization `gorm:"foreignKey:IDOrganization"`
	Params         QueueParams  `gorm:"foreignKey:IDQueue;references:ID"`
	Entries        []QueueEntry `gorm:"foreignKey:IDQueue;references:ID"`
}

func (Queue) TableName() string {
	return `"queue"`
}

// таблица "queue_params"
type QueueParams struct {
	ID                 uuid.UUID `gorm:"type:uuid;primaryKey"`
	IDQueue            uuid.UUID `gorm:"column:id_queue;type:uuid;not null"`
	ArrivalGracePeriod int       `gorm:"default:5;not null"`
	MaxQueueSize       int       `gorm:"default:100;not null"`
	IsActive           bool      `gorm:"default:true;not null"`
}

func (QueueParams) TableName() string {
	return `"queue_params"`
}

// таблица "queue_entry"
type QueueEntry struct {
	ID      uuid.UUID   `gorm:"type:uuid;primaryKey"`
	IDQueue uuid.UUID   `gorm:"column:id_queue;type:uuid;not null"`
	IDmax   int64       `gorm:"column:id_max;not null"`
	Status  string      `gorm:"type:queue_status;not null"`
	Queue   Queue       `gorm:"foreignKey:IDQueue"`
	User    User        `gorm:"foreignKey:IDmax"`
	Meta    []EntryMeta `gorm:"foreignKey:IDQueueEntry;references:ID"`
}

func (QueueEntry) TableName() string {
	return `"queue_entry"`
}

// таблица "queue_entry_meta"
type EntryMeta struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey"`
	IDQueueEntry uuid.UUID  `gorm:"column:id_queue_entry;type:uuid;not null"`
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
