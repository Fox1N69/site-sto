package service

import (
	"errors"
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type BasketService interface {
	Create(user model.User) error
	AddItem(userID uint, item model.BasketItem) error
	RemoveItem(itemID uint) error
	GetBasketByUserID(userID uint) (*model.Basket, error)
	UpdateBasketItem(id uint, item model.BasketItem) error
	UpdateBasketItemQuantity(userID, autoPartID, quantity uint) error
	RemoveAllItems(basketID uint) error
	CheckBasket(basketID, autoPartID uint) (bool, error)
}

type basketService struct {
	basketRepo   repo.BasketRepo
	autoPartRepo repo.AutoPartRepo
}

func NewBasketService(basketRepo repo.BasketRepo, autoPartRepo repo.AutoPartRepo) BasketService {
	return &basketService{basketRepo: basketRepo, autoPartRepo: autoPartRepo}
}

func (s *basketService) GetBasketByUserID(userID uint) (*model.Basket, error) {
	return s.basketRepo.GetBasketByUserID(userID)
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

func (s *basketService) RemoveItem(itemID uint) error {
	return s.basketRepo.RemoveItemFromBasket(itemID)
}

func (s *basketService) AddItemToBasket(userID uint, item model.BasketItem) error {
	// Проверить существование AutoPart и его наличие на складе
	exists, err := s.autoPartRepo.Exists(item.AutoPartID)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New("auto part does not exist")
	}

	stock, err := s.autoPartRepo.GetStock(item.AutoPartID)
	if err != nil {
		return err
	}
	if stock < item.Quantity {
		return errors.New("insufficient stock")
	}

	if err := s.basketRepo.AddItemToBasket(userID, item); err != nil {
		return err
	}
	return s.autoPartRepo.UpdateStock(item.AutoPartID, -int(item.Quantity))
}

func (s *basketService) UpdateBasketItem(id uint, item model.BasketItem) error {
	return s.basketRepo.UpdateBasketItem(id, item)
}

func (s *basketService) UpdateBasketItemQuantity(userID, autoPartID, quantity uint) error {
	return s.basketRepo.UpdateBasketItemQuantity(userID, autoPartID, quantity)
}

func (s *basketService) RemoveAllItems(basketID uint) error {
	return s.basketRepo.RemoveAllItems(basketID)
}

func (s *basketService) CheckBasket(basketID, autoPartID uint) (bool, error) {
	return s.basketRepo.CheckBasket(basketID, autoPartID)
}
