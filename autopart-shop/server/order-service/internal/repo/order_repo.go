package repo

import (
	"fmt"
	"shop-server-order/internal/models"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type OrderRepo interface {
	CreateOrder(order models.Order) (uint, error)
	CreateVinOrder(vinOrder models.VinOrder) (*models.VinOrder, error)
	Orders() ([]models.VinOrder, error)
	Delete(id uint) error
}

type orderRepo struct {
	db *gorm.DB
}

func NewOrderRepo(db *gorm.DB) OrderRepo {
	return &orderRepo{db: db}
}

func (r *orderRepo) CreateOrder(order models.Order) (uint, error) {
	if err := r.db.Create(&order).Error; err != nil {
		logrus.Errorf("Failed to create order: %v", err)
		return 0, fmt.Errorf("failed to create order: %v", err)
	}

	return order.ID, nil
}

func (r *orderRepo) CreateVinOrder(vinOrder models.VinOrder) (*models.VinOrder, error) {
	if err := r.db.Create(&vinOrder).Error; err != nil {
		logrus.Errorf("Failed to create order: %v", err)
		return &models.VinOrder{}, fmt.Errorf("failed to create order: %v", err)
	}

	return &vinOrder, nil
}

func (r *orderRepo) Orders() ([]models.VinOrder, error) {
	var order []models.VinOrder
	if err := r.db.Find(&order).Error; err != nil {
		logrus.Error("faile to get vin orders")
		return nil, fmt.Errorf("failed to get vin orders: %v", err)
	}

	return order, nil
}

func (r *orderRepo) Delete(id uint) error {
	var order models.VinOrder
	return r.db.Where("id = ?", id).Delete(&order).Error
}
