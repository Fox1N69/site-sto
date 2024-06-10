package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type BasketService interface {
	Create(basket model.Basket) error
	CreateForUser(userID uint) error
}

type basketService struct {
	basketRepo repo.BasketRepo
}

func NewBasketService(basketRepo repo.BasketRepo) BasketService {
	return &basketService{basketRepo: basketRepo}
}

func (s *basketService) Create(basket model.Basket) error {
	return s.basketRepo.Create(basket)
}

func (s *basketService) CreateForUser(userID uint) error {
	return s.basketRepo.CreateForUser(userID)
}
