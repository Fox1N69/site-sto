package repo

import (
	"context"
	"fmt"
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type OrderRepo interface {
	CreateOrder(ctx context.Context, order *model.Order) error
	CreateVinOrder(vin *model.VinOrder) error
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
	// Получаем пользователя, связанного с заказом
	var user model.User
	if result := r.db.First(&user, order.UserID); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return fmt.Errorf("пользователь с ID %d не найден", order.UserID)
		}
		return result.Error
	}

	// Заполняем недостающие поля заказа информацией пользователя
	if order.Email == "" {
		if user.Email == "" {
			return fmt.Errorf("пользователь с ID %d не имеет email и email заказа не указан", order.UserID)
		}
		order.Email = user.Email
	}

	if order.PhoneNumber == "" {
		if user.PhoneNumber == "" {
			return fmt.Errorf("пользователь с ID %d не имеет номера телефона и номер телефона заказа не указан", order.UserID)
		}
		order.PhoneNumber = user.PhoneNumber
	}

	if order.DeliveryAddress == "" {
		if user.DeliveryAddress == "" {
			return fmt.Errorf("пользователь с ID %d не имеет адреса и адрес заказа не указан", order.UserID)
		}
		order.DeliveryAddress = user.DeliveryAddress
	}

	if order.DeliveryCity == "" {
		if user.DeliveryCity == "" {
			return fmt.Errorf("пользователь с ID %d не имеет города доставки и город доставки заказа не указан", order.UserID)
		}
		order.DeliveryCity = user.DeliveryCity
	}

	// Создаем заказ в транзакции
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Создаем заказ
	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Получаем ID созданного заказа
	if order.ID == 0 {
		return fmt.Errorf("не удалось получить идентификатор созданного заказа")
	}

	// Создаем связанные VinOrders
	for i := range order.VinOrders {
		order.VinOrders[i].OrderID = order.ID
		// Не устанавливаем ID вручную, он должен быть сгенерирован базой данных
		if err := tx.Create(&order.VinOrders[i]).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Фиксируем транзакцию
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (r *orderRepo) CreateVinOrder(vin *model.VinOrder) error {
	if vin.OrderID == 0 {
		return fmt.Errorf("OrderID не может быть нулевым")
	}
	if err := r.db.Create(&vin).Error; err != nil {
		return err
	}

	return nil
}

// GetAllOrders...
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
