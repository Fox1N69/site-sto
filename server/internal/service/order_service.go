package service

import (
	"server/internal/models"
	"server/internal/repository"
	"time"
)

type OrderService struct {
	repository *repository.OrderRepository
}

func NewOrderService(repo *repository.OrderRepository) *OrderService {
	return &OrderService{
		repository: repo,
	}
}

func (os *OrderService) CreateOrder(customerID uint, shopID uint, totalAmount float64) (*models.Order, error) {
	order := &models.Order{
		CustomerID:  customerID,
		ShopID:      shopID,
		OrderDate:   time.Now(),
		Status:      "В обработке",
		TotalAmount: totalAmount,
	}

	if err := os.repository.CreateOrder(order); err != nil {
		return nil, err
	}

	return order, nil
}
