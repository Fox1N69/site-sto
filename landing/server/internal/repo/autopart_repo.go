package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type AutoPRepo interface {
	Create(product model.AutoPart) error
	GetAll() ([]model.AutoPart, error)
	GetByID(id uint) (*model.AutoPart, error)
	Update(product model.AutoPart) (*model.AutoPart, error)
	Delete(product model.AutoPart) error
	GetByCategory(category string) ([]model.AutoPart, error)
	GetSortedByPrice() ([]model.AutoPart, error)
}

type autoPRepo struct {
	db *gorm.DB
}

func NewAutoPRepo(db *gorm.DB) AutoPRepo {
	return &autoPRepo{db: db}
}

func (s *autoPRepo) Create(product model.AutoPart) error {
	return s.db.Create(product).Error
}

func (s *autoPRepo) GetAll() ([]model.AutoPart, error) {
	return nil, nil
}

func (s *autoPRepo) GetByID(id uint) (*model.AutoPart, error) {
	return nil, nil
}

func (s *autoPRepo) Update(product model.AutoPart) (*model.AutoPart, error) {
	return nil, nil
}

func (s *autoPRepo) Delete(product model.AutoPart) error {
	return s.db.Delete(product).Error
}

func (s *autoPRepo) GetByCategory(category string) ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Where("category = ?", category).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *autoPRepo) GetSortedByPrice() ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Order("price").Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}
