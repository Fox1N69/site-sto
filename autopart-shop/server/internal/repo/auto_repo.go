package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type AutoRepo interface {
	GetAll() ([]model.ModelAuto, error)
}

type autoRepo struct {
	db *gorm.DB
}

func NewAutoRepo(db *gorm.DB) AutoRepo {
	return &autoRepo{db: db}
}

func (r *autoRepo) GetAll() ([]model.ModelAuto, error) {
	var modelAuto []model.ModelAuto
	if err := r.db.Preload("Brand").Find(&modelAuto).Error; err != nil {
		return nil, err
	}
	return modelAuto, nil
}
