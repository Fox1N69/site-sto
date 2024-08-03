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

func (r *BotRepo) GetOrderByID(id uint) (*models.Order, error) {
	var order *models.Order
	if err := r.db.Where("id = ?", id).First(&order).Error; err != nil {
		return &models.Order{}, err
	}

	return nil, nil
}
