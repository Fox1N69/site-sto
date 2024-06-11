package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type CategoryRepo interface {
	CreateCategory(newCategory *model.Category) error
	GetCategoryByID(categoryID uint) (*model.Category, error)
	UpdateCategory(category *model.Category) error
	DeleteCategory(categoryID uint) error
	AssociateCategoryToBrand(categoryID, BrandID uint) error
	RemoveBrandFromCategory(categoryID, brandID uint) error
}

type categoryRepo struct {
	db *gorm.DB
}

func NewCategoryRepo(db *gorm.DB) CategoryRepo {
	return &categoryRepo{
		db: db,
	}
}

func (cp *categoryRepo) CreateCategory(newCategory *model.Category) error {
	return cp.db.Create(newCategory).Error
}

func (cp *categoryRepo) GetCategoryByID(categoryID uint) (*model.Category, error) {
	return nil, nil
}

func (cp *categoryRepo) UpdateCategory(category *model.Category) error {
	return nil
}

func (cp *categoryRepo) DeleteCategory(categoryID uint) error {
	return cp.db.Delete(categoryID).Error
}

func (cp *categoryRepo) AssociateCategoryToBrand(categoryID, BrandID uint) error {
	return nil
}

func (cp *categoryRepo) RemoveBrandFromCategory(categoryID, brandID uint) error {
	return nil
}
