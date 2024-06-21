package service

import (
	"context"
	"errors"
	"fmt"
	"shop-server/internal/model"
	"shop-server/internal/repo"

	"gorm.io/gorm"
)

type OrderService interface {
}

type orderService struct {
	repo repo.OrderRepo
}

func NewOrderService(orderRepo repo.OrderRepo) OrderService {
	return orderService{repo: orderRepo}
}

func (s *orderService) CreateOrder(order *model.Order) error {
	if err := s.repo.CreateOrder(order); err != nil {
		return err
	}

	return nil
}

func (s *orderService) GetAllOrders(ctx context.Context) ([]model.Order, error) {
	orders, err := s.repo.GetAllOrders()
	if err != nil {
		return nil, fmt.Errorf("failed to get all orders %w", err)
	}

	return orders, nil
}

func (s *orderService) UpdateOrder(ctx context.Context, id uint, orderData map[string]interface{}) error {

	if err := s.repo.UpdateOrder(id, orderData); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("order not found: %w", err)
		}

		return fmt.Errorf("failed to update order: %w", err)
	}

	return nil
}
