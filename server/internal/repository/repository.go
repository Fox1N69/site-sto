package repository

import (
	"gorm.io/gorm"
)

type Repositorys struct {
	db    *gorm.DB
	Order *OrderRepository
	User  *UserRepository
}

func NewRepositorys(db *gorm.DB) *Repositorys {
	return &Repositorys{
		db:    db,
		Order: NewOrderRepository(db),
		User:  NewUserRepository(db),
	}
}

func (r *Repositorys) GetAllData(data interface{}) error {
	return r.db.Find(data).Error
}
