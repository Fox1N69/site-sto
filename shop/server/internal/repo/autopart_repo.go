package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type AutoPartRepo interface {
	Create(product model.AutoPart) error
	GetAll() ([]model.AutoPart, error)
	GetByID(id uint) (*model.AutoPart, error)
	Update(product model.AutoPart) error
	Delete(id uint) error
}

type autoPartRepo struct {
	db *gorm.DB
}

func NewAutoPartRepo(db *gorm.DB) AutoPartRepo {
	return &autoPartRepo{db: db}
}

func (s *autoPartRepo) Create(product model.AutoPart) error {
	return s.db.Create(&product).Error
}

func (s *autoPartRepo) GetAll() ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *autoPartRepo) GetByID(id uint) (*model.AutoPart, error) {
	var product model.AutoPart
	if err := s.db.First(&product, id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (s *autoPartRepo) Update(product model.AutoPart) error {
	return s.db.Save(&product).Error
}

func (s *autoPartRepo) Delete(id uint) error {
	return s.db.Delete(&model.AutoPart{}, id).Error
}
