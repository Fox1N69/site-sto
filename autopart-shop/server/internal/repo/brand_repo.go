package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type BrandRepo interface {
	CreateBrand(brand *model.Brand) error
	GetAllBrand() ([]model.Brand, error)
	GetBrandByID(id uint) (*model.Brand, error)
	UpdateBrand(brand *model.Brand) error
	DeleteBrand(brandID uint) error
	AssociateCategoryFromBrand(brandID uint, categoryID uint) error
	RemoveCategoryFromBrand(brandID uint, categoryID uint) error
}

type brandRepo struct {
	db *gorm.DB
}

func NewBrandRepo(db *gorm.DB) BrandRepo {
	return &brandRepo{db: db}
}

func (br *brandRepo) CreateBrand(brand *model.Brand) error {
	return br.db.Create(brand).Error
}

func (br *brandRepo) GetAllBrand() ([]model.Brand, error) {
	var brands []model.Brand
	err := br.db.Find(&brands).Error
	return brands, err
}

func (br *brandRepo) GetBrandByID(id uint) (*model.Brand, error) {
	var brand model.Brand
	err := br.db.First(&brand, id).Error
	return &brand, err
}

func (br *brandRepo) UpdateBrand(brand *model.Brand) error {
	return br.db.Save(brand).Error
}

func (repo *brandRepo) DeleteBrand(brandID uint) error {
	brand := &model.Brand{ShopCustom: model.ShopCustom{ID: brandID}}
	return repo.db.Delete(brand).Error
}

func (br *brandRepo) AssociateCategoryFromBrand(brandID uint, categoryID uint) error {
	brand := &model.Brand{ShopCustom: model.ShopCustom{ID: brandID}}
	category := &model.Category{ShopCustom: model.ShopCustom{ID: categoryID}}
	return br.db.Model(brand).Association("Categories").Append(category)
}

func (br *brandRepo) RemoveCategoryFromBrand(brandID uint, categoryID uint) error {
	brand := &model.Brand{ShopCustom: model.ShopCustom{ID: brandID}}
	category := &model.Category{ShopCustom: model.ShopCustom{ID: categoryID}}
	return br.db.Model(brand).Association("Categories").Delete(category)
}
