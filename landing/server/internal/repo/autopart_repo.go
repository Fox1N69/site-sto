package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type AutoPRepo interface {
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

type autoPRepo struct {
	db *gorm.DB
}

func NewAutoPRepo(db *gorm.DB) AutoPRepo {
	return &autoPRepo{db: db}
}

func (s *autoPRepo) Create(product model.AutoPart) error {
	return s.db.Create(&product).Error
}

func (s *autoPRepo) GetAll() ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *autoPRepo) GetByID(id uint) (*model.AutoPart, error) {
	var product model.AutoPart
	if err := s.db.First(&product, id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (s *autoPRepo) Update(product model.AutoPart) error {
	return s.db.Save(&product).Error
}

func (s *autoPRepo) Delete(id uint) error {
	return s.db.Delete(&model.AutoPart{}, id).Error
}

func (s *autoPRepo) GetByCategory(categoryID uint) ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Where("category_id = ?", categoryID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *autoPRepo) GetSortedByPrice(order string) ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Order("price " + order).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *autoPRepo) GetByBrand(brandID uint) ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Where("brand_id = ?", brandID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}
func (s *autoPRepo) GetAvailable() ([]model.AutoPart, error) {
	var products []model.AutoPart
	if err := s.db.Where("deleted_at IS NULL").Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}
