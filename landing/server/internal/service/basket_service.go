package service

import "shop-server/internal/repo"

type BasketService interface {
}

type basketService struct {
	basketRepo repo.BasketRepo
}

func NewBasketService(basketRepo repo.BasketRepo) BasketService {
	return &basketService{basketRepo: basketRepo}
}
