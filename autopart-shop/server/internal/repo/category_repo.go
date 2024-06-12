package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type CategoryRepo interface {
	CreateCategory(newCategory *model.Category) error
	GetCategoryByID(id uint) (*model.Category, error)
	UpdateCategory(category *model.Category) error
	DeleteCategory(id uint) error
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

func (cr *categoryRepo) CreateCategory(newCategory *model.Category) error {
	return cr.db.Create(newCategory).Error
}

func (repo *categoryRepo) GetCategoryByID(id uint) (*model.Category, error) {
	var category model.Category

	err := repo.db.Preload("Brand").First(&category, id).Error

	return &category, err
}

func (cr *categoryRepo) UpdateCategory(category *model.Category) error {
	return cr.db.Save(category).Error
}

func (cr *categoryRepo) DeleteCategory(id uint) error {
	return cr.db.Delete(id).Error
}

func (cr *categoryRepo) AssociateCategoryToBrand(categoryID, brandID uint) error {
	category := &model.Category{ShopCustom: model.ShopCustom{ID: categoryID}}
	brand := &model.Brand{ShopCustom: model.ShopCustom{ID: brandID}}
	return cr.db.Model(category).Association("Brands").Append(brand)
}

func (cr *categoryRepo) RemoveBrandFromCategory(categoryID, brandID uint) error {
	category := &model.Category{ShopCustom: model.ShopCustom{ID: categoryID}}
	brand := &model.Brand{ShopCustom: model.ShopCustom{ID: brandID}}
	return cr.db.Model(category).Association("Brands").Delete(brand)
}
