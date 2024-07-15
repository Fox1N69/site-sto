package service

import "shop-server/internal/repo"

type OrderService interface {
}

type orderService struct {
	repo repo.OrderRepo
}

func NewOrderService(repository repo.OrderRepo) OrderService {
	return &orderService{repo: repository}
}


