package repo

import "gorm.io/gorm"

type OrderRepo interface {
}

type orderRepo struct {
	db *gorm.DB
}

func NewOrderRepo(db *gorm.DB) OrderRepo {
	return &orderRepo{db: db}
}
