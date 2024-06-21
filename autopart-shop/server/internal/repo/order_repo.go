package repo

import (
	"context"
	"fmt"
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type OrderRepo interface {
	CreateOrder(ctx context.Context, order *model.Order) error
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

func (r *orderRepo) CreateOrder(ctx context.Context, order *model.Order) error {
	var user model.User
	if result := r.db.First(&user, order.UserID); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return fmt.Errorf("user with ID %d not found", order.UserID)
		}
		return result.Error
	}

	if order.Email == "" {
		if user.Email == "" {
			return fmt.Errorf("user with ID %d does not have an email and order email is not provided", order.UserID)
		}
		order.Email = user.Email
	}

	if order.PhoneNumber == "" {
		if user.PhoneNumber == "" {
			return fmt.Errorf("user with ID %d does not have a phone number and order phone number is not provided", order.UserID)
		}
		order.PhoneNumber = user.PhoneNumber
	}

	if order.DeliveryAddress == "" {
		if user.DeliveryAddress == "" {
			return fmt.Errorf("user with ID %d does not have an address and order address is not provided", order.UserID)
		}
		order.DeliveryAddress = user.DeliveryAddress
	}

	if order.DeliveryCity == "" {
		if user.DeliveryCity == "" {
			return fmt.Errorf("user with ID %d does not have and addres city and order address in not provided", order.UserID)
		}
		order.DeliveryCity = user.DeliveryCity
	}

	// Create the order
	if err := r.db.Create(order).Error; err != nil {
		return err
	}

	return nil
}

func (r *orderRepo) GetAllOrders() ([]model.Order, error) {
	var order []model.Order

	result := r.db.Preload("User").Find(&order)
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
