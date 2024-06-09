package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type ShopRepo interface {
}

type shopRepo struct {
	db *gorm.DB
}

func NewShopRepo(db *gorm.DB) ShopRepo {
	return &shopRepo{db: db}
}

func (s *shopRepo) Create(product model.AutoPart) error {
	return s.db.Create(product).Error
}

func (s *shopRepo) GetAll() ([]model.AutoPart, error) {
	return nil, nil
}

func (s *shopRepo) GetByID(id uint) (*model.AutoPart, error) {
	return nil, nil
}

func (s *shopRepo) Update(product *model.AutoPart) (*model.AutoPart, error) {
	return nil, nil
}

func (s *shopRepo) Delete(product *model.AutoPart) error {
	return s.db.Delete(product).Error
}
