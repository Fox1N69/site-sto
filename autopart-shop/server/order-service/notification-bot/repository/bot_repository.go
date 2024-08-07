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

func (r *BotRepo) GetOrderWithVinOrders(orderID uint) (*models.Order, error) {
	var order models.Order
	if err := r.db.Preload("VinOrder").First(&order, orderID).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *BotRepo) GetUserByID(id int64) (*models.NotificationUser, error) {
	var user models.NotificationUser
	if err := r.db.Where("id = ?", id).Find(&user).Error; err != nil {
		return &models.NotificationUser{}, err
	}

	return &user, nil
}

func (r *BotRepo) GetLastOrder() (*models.Order, error) {
	var order models.Order
	if err := r.db.Order("create_at desc").Find(&order).Error; err != nil {
		return nil, err
	}

	return &order, nil
}
