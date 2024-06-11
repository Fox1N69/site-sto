package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type BrandRepo interface {
	CreateBrand(brand *model.Brand) error
	GetBrandByID(id uint) (*model.Brand, error)
	UpdateBrand(brand *model.Brand) error
	DeleteBrand(id uint) error
}

type brandRepo struct {
	db *gorm.DB
}

func NewBrandRepo(db *gorm.DB) BrandRepo {
	return &brandRepo{db: db}
}

func (br *brandRepo) CreateBrand(brand *model.Brand) error {
	return nil
}

func (br *brandRepo) GetBrandByID(id uint) (*model.Brand, error) {
	return nil, nil
}

func (br *brandRepo) UpdateBrand(brand *model.Brand) error {
	return nil
}

func (br *brandRepo) DeleteBrand(id uint) error {
	return nil
}
