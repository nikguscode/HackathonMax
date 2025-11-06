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
	QueueEntries     []QueueEntry `gorm:"foreignKey: UserID"`
}

// таблица "role"
type Role struct {
	ID        uuid.UUID  `gorm:"type: uuid; primaryKey"`
	Name      string     `gorm:"size: 50; unique; not null"`
	UserRoles []UserRole `gorm:"foreignKey: IDRole"`
}

// таблица "organization"
type Organization struct {
	ID          uuid.UUID `gorm:"type: uuid; primaryKey"`
	Name        string    `gorm:"size: 255; not null"`
	Description string
	Address     string
	IsBanned    bool
	CreatedAt   time.Time  `gorm:"default: now()"`
	UserRoles   []UserRole `gorm:"foreignKey: IDOrganization"`
	Queues      []Queue    `gorm:"foreignKey: OrganizationID"`
}

// таблица "user_role"
type UserRole struct {
	ID             uuid.UUID    `gorm:"type: uuid"`
	IDUser         uuid.UUID    `gorm:"type: uuid; not null"`
	IDRole         uuid.UUID    `gorm:"type: uuid; not null"`
	IDOrganization uuid.UUID    `gorm:"type: uuid; not null"`
	User           User         `gorm:"foreignKey: IDUser"`
	Role           Role         `gorm:"foreignKey: IDRole"`
	Organization   Organization `gorm:"foreignKey: IDOrganization"`
}

// таблица "queue"
type Queue struct {
	ID             uuid.UUID    `gorm:"type: uuid; primaryKey"`
	OrganizationID uuid.UUID    `gorm:"type: uuid; not null"`
	Name           string       `gorm:"size: 255; not null"`
	CreatedAt      time.Time    `gorm:"default: now()"`
	Organization   Organization `gorm:"foreignKey: OrganizationID"`
	Params         QueueParams  `gorm:"foreignKey: QueueID"`
	Entries        []QueueEntry `gorm:"foreignKey: QueueID"`
}

// таблица "queue_params"
type QueueParams struct {
	ID                 uuid.UUID `gorm:"type: uuid; primaryKey"`
	QueueID            uuid.UUID `gorm:"type: uuid; not null"`
	ArrivalGracePeriod string    `gorm:"type: interval; deffault: '5 minutes'"`
	MaxQueueSize       int       `gorm:"default: 100"`
	IsActive           bool      `gorm:"default: true"`
}

// таблица "queue_entrie"
type QueueEntry struct {
	ID      uuid.UUID   `gorm:"type: uuid; primaryKey"`
	QueueID uuid.UUID   `gorm:"type: uuid; not null"`
	UserID  uuid.UUID   `gorm:"type: uuid; not null"`
	Status  string      `gorm:"size: 50; default: 'waiting'"`
	Queue   Queue       `gorm:"foreignKey: QueueID"`
	User    User        `gorm:"foreignKey: UserID"`
	Meta    []EntryMeta `gorm:"foreignKey: QueueEntrieID"`
}

// таблица "queue_entrie_meta"
type EntryMeta struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey"`
	QueueEntrieID uuid.UUID `gorm:"type:uuid;not null"`
	JoinedAt      time.Time `gorm:"default:now()"`
	CalledAt      *time.Time
	ArrivedAt     *time.Time
	MissedAt      *time.Time
	StartedAt     *time.Time
	FinishedAt    *time.Time
	TimeLimit     *time.Time
	QueueEntry    QueueEntry `gorm:"foreignKey:QueueEntrieID"`
}

func (User) TableName() string {
	return `"user"`
}

func (Role) TableName() string {
	return `"role"`
}

func (Organization) TableName() string {
	return `"organization"`
}

func (UserRole) TableName() string {
	return `"user_role"`
}

func (Queue) TableName() string {
	return `"queue"`
}

func (QueueParams) TableName() string {
	return `"queue_params"`
}

func (QueueEntry) TableName() string {
	return `"queue_entrie"`
}

func (EntryMeta) TableName() string {
	return `"queue_entrie_meta"`
}
