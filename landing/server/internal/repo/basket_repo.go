package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type BasketRepo interface {
	Create(basket *model.Basket) error
	GetAllItems(basket *model.Basket) ([]model.BasketItem, error)
	AddItem(basket *model.Basket, items []model.BasketItem) error
	RemoveItem(basket *model.Basket, items []model.BasketItem) error
}

type basketRepo struct {
	db *gorm.DB
}

func NewBasketRepo(db *gorm.DB) BasketRepo {
	return &basketRepo{db: db}
}

func (r *basketRepo) Create(basket *model.Basket) error {
	return r.db.Create(basket).Error
}

func (r *basketRepo) GetAllItems(basket *model.Basket) ([]model.BasketItem, error) {
	return nil, nil
}

func (r *basketRepo) AddItem(basket *model.Basket, items []model.BasketItem) error {
	return nil
}

func (r *basketRepo) RemoveItem(basket *model.Basket, items []model.BasketItem) error {
	return nil
}
