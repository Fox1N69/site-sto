package model

import (
	"database/sql"
	"time"
)

type GormCustom struct {
	ID        uint         `json:"id" gorm:"primary_key"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at" sql:"index"`
}

type User struct {
	GormCustom
	Username    string  `json:"username" gorm:"unique"`
	Password    string  `json:"password"`
	FIO         string  `json:"fio"`
	Email       string  `json:"email" gorm:"unique"`
	Role        string  `json:"role" gorm:"default:'user'"`
	PhoneNumber string  `json:"phone_number"`
	Basket      *Basket `gorm:"foreignKey:UserID"`
}

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
