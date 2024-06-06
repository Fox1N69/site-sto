package models

import "database/sql/driver"

type RegisterData struct {
	ID       uint   `json:"id"`
	UserID   uint   `json:"user_id" gorm:"uniqueIndex;not null"` // Внешний ключ на User
	Username string `json:"username" gorm:"unique"`
	Email    string `json:"email" gorm:"unique"`
	Password []byte `json:"hashPassword"`
}

type User struct {
	UserID         uint         `json:"id" gorm:"primaryKey;autoIncrement"`
	Username       string       `json:"username"`
	Password       []byte       `json:"password"`
	IsActivated    bool         `json:"is_activated"`
	ActivationLink string       `json:"activation_link"`
	FullName       string       `json:"full_name"`
	Email          string       `json:"email"`
	DateOfBirth    string       `json:"date_of_birth"`
	Location       string       `json:"location"`
	Role           string       `json:"role"`
	Permissions    string       `json:"permissions"`
	Token          Token        `json:"-" gorm:"foreignKey:UserID"` // Связь с таблицей Token
	RegisterData   RegisterData `json:"-" gorm:"foreignKey:UserID"` // Связь с таблицей RegisterData
}

type Token struct {
	ID           uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID       uint   `json:"user_id" gorm:"uniqueIndex;not null"` // Внешний ключ на User
	RefreshToken []byte `json:"refresh_token"`
}

type LoginData struct {
	ID             uint   `json:"id"`
	RegisterDataID uint   `json:"register_data_id"`
	Email          string `json:"email"`
	Password       []byte `json:"hashPassword"`
}

func (u User) Value() (driver.Value, error) {
	return u.UserID, nil
}

// Implement the Scanner interface
func (u *User) Scan(value interface{}) error {
	u.UserID = value.(uint)
	return nil
}
