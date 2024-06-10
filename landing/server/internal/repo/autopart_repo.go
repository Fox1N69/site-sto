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
	GetByCategory(categoryID uint) ([]model.AutoPart, error)
	
	GetSortedByPrice(order string) ([]model.AutoPart, error)
	GetByBrand(brandID uint) ([]model.AutoPart, error)
	GetAvailable() ([]model.AutoPart, error)
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

func (s *autoPartRepo) GetByCategory(categoryID uint) ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Where("category_id = ?", categoryID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *autoPartRepo) GetSortedByPrice(order string) ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Order("price " + order).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *autoPartRepo) GetByBrand(brandID uint) ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Where("brand_id = ?", brandID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}
func (s *autoPartRepo) GetAvailable() ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Where("deleted_at IS NULL").Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}
