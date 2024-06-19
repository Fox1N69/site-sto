package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type AutoRepo interface {
	Create(auto *model.ModelAuto) error
	GetAll() ([]model.ModelAuto, error)
	GetByBrandID(brandID uint) ([]model.ModelAuto, error)
	Update(auto *model.ModelAuto) error
	Delete(id uint) error
}

type autoRepo struct {
	db *gorm.DB
}

func NewAutoRepo(db *gorm.DB) AutoRepo {
	return &autoRepo{db: db}
}

func (r *autoRepo) Create(auto *model.ModelAuto) error {
	return r.db.Create(&auto).Error
}

func (r *autoRepo) GetAll() ([]model.ModelAuto, error) {
	var modelAuto []model.ModelAuto
	if err := r.db.Preload("Brand").Find(&modelAuto).Error; err != nil {
		return nil, err
	}
	return modelAuto, nil
}

func (r *autoRepo) GetByBrandID(brandID uint) ([]model.ModelAuto, error) {
	var modelAuto []model.ModelAuto

	if err := r.db.Preload("Brand").Where("brand_id = ?", brandID).Find(&modelAuto).Error; err != nil {
		return nil, err
	}

	return modelAuto, nil
}

func (r *autoRepo) Update(auto *model.ModelAuto) error {
	return nil
}

func (r *autoRepo) Delete(id uint) error {
	return r.db.Where("id = ?", id).Delete(&model.ModelAuto{}).Error
}
