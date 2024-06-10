package repo

import "gorm.io/gorm"

type BasketRepo interface {
}

type basketRepo struct {
	db *gorm.DB
}

func NewBasketRepo(db *gorm.DB) BasketRepo {
	return &basketRepo{db: db}
}
