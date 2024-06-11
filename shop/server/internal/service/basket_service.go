package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type BasketService interface {
	Create(user model.User) error
	AddItem(userID uint, item model.BasketItem) error
}

type basketService struct {
	basketRepo repo.BasketRepo
}

func NewBasketService(basketRepo repo.BasketRepo) BasketService {
	return &basketService{basketRepo: basketRepo}
}

func (s *basketService) Create(user model.User) error {
	basket := model.Basket{
		UserID: user.ID,
	}

	if err := s.basketRepo.Create(&basket); err != nil {
		return err
	}

	return nil
}

func (s *basketService) AddItem(userID uint, item model.BasketItem) error {
	return s.basketRepo.AddItemToBasket(userID, item)
}
