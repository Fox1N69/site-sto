package repository

import (
	"shop-server-order/internal/models"

	"gorm.io/gorm"
)

type BotRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) BotRepo {
	return BotRepo{db: db}
}

func (r *BotRepo) Save(user *models.NotificationUser) error {
	return r.db.Create(user).Error
}

