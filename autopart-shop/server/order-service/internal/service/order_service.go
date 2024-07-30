package service

import (
	"shop-server-order/internal/models"
	"shop-server-order/internal/repo"
)

type OrderService interface {
	CreateOrder(order models.VinOrder) (uint, error)
	GetAllOrders() ([]models.VinOrder, error)
	DeleteOrder(id uint) error
}

type orderService struct {
	repository repo.OrderRepo
}

func NewOrderService(orderRepository repo.OrderRepo) OrderService {
	return &orderService{
		repository: orderRepository,
	}
}

func (s *orderService) CreateOrder(order models.VinOrder) (uint, error) {
	return s.repository.Create(order)
}

func (s *orderService) GetAllOrders() ([]models.VinOrder, error) {
	return s.repository.Orders()
}

func (s *orderService) DeleteOrder(id uint) error {
	return s.repository.Delete(id)
}
