package models

import "time"

type UserEvent struct {
	GormCustom
	UserID     uint      `json:"user_id"`
	EventType  string    `json:"event_type"`
	AutoPartID uint      `json:"auto_part_id"`
	Timestamp  time.Time `json:"timestamp"`
}
