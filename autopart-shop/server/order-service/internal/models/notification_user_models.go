package models

import "time"

type NotificationUser struct {
	ID        int64     `json:"id" gorm:"primaryKey"`
	FirstName string    `json:"first_name"`
	Username  string    `json:"username"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
	ChatID    int64     `json:"chat_id"`
}
