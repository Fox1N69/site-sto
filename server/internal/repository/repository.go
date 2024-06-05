package repository

import (
	"gorm.io/gorm"
)

type Repositorys struct {
	db *gorm.DB
}

func NewRepositorys(db *gorm.DB) *Repositorys {
	return &Repositorys{
		db: db,
	}
}

func (r *Repositorys) GetAllData(data interface{}) error {
	return r.db.Find(data).Error
}
