package service

import (
	"shop-server-order/internal/repo"
)

type OrderService interface {
}

type orderService struct {
	repository repo.OrderRepo
}

func NewOrderService(orderRepository repo.OrderRepo) OrderService {
	return &orderService{
		repository: orderRepository,
	}
}
