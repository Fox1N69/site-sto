package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type OrderRepo interface {
	CreateOrder(order *model.Order) error
	GetAllOrders() ([]model.Order, error)
	UpdateOrder(id uint, orderData map[string]interface{}) error
	DeleteOrder(id uint) error
}

type orderRepo struct {
	db *gorm.DB
}

func NewOrderRepo(db *gorm.DB) OrderRepo {
	return &orderRepo{db: db}
}

func (r *orderRepo) CreateOrder(order *model.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepo) GetAllOrders() ([]model.Order, error) {
	var order []model.Order

	result := r.db.Preload("Users").Find(&order)
	if result.Error != nil {
		return nil, result.Error
	}

	return order, nil
}

func (r *orderRepo) UpdateOrder(id uint, orderData map[string]interface{}) error {
	var order model.Order
	result := r.db.Preload("Users").Where("id = ?", id).Find(&order)
	if result.Error != nil {
		return result.Error
	}

	userData := order.User
	userEmail := userData.Email
	userPhone := userData.PhoneNumber
	userAddress := userData.DeliveryAddress

	for key, value := range orderData {
		switch key {
		case "status":
			order.Status = value.(string)
		case "email":
			userEmail = value.(string)
		case "phone":
			userPhone = value.(string)
		case "address":
			userAddress = value.(string)
		}
	}

	r.db.Model(&userData).Updates(map[string]interface{}{
		"email":   userEmail,
		"phone":   userPhone,
		"address": userAddress,
	})

	result = r.db.Save(&order)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *orderRepo) DeleteOrder(id uint) error {
	var order model.Order
	result := r.db.Where("id = ?", id).First(&order)
	if result.Error != nil {
		return result.Error
	}
	return r.db.Delete(&order).Error
}
