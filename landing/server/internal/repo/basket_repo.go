package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type BasketRepo interface {
	Create(basket model.Basket) error
	AddItems(baskte model.Basket, items []model.BasketItem) error
}

type basketRepo struct {
	db *gorm.DB
}

func NewBasketRepo(db *gorm.DB) BasketRepo {
	return &basketRepo{db: db}
}

func (r *basketRepo) Create(basket model.Basket) error {
	return r.db.Create(basket).Error
}

func (r *basketRepo) AddItems(basket model.Basket, items []model.BasketItem) error {
	return nil
}
