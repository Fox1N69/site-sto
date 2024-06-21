package service

import "shop-server/internal/repo"

type OrderService interface {
}

type orderService struct {
	repo repo.OrderRepo
}

func NewOrderService(orderRepo repo.OrderRepo) OrderService {
	return orderService{repo: orderRepo}
}
