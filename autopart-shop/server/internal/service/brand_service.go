package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type BrandService interface {
	CreateBrand(brand *model.Brand) error
	GetAllBrand() ([]model.Brand, error)
	GetBrandByID(id uint) (*model.Brand, error)
	UpdateBrand(brand *model.Brand) error
	DeleteBrand(brandID uint) error
	AssociateCategoryFromBrand(brandID uint, categoryID uint) error
	RemoveCategoryFromBrand(brandID uint, categoryID uint) error
}

type brandService struct {
	brandRepo repo.BrandRepo
}

func NewBrandService(brandRepo repo.BrandRepo) BrandService {
	return &brandService{brandRepo: brandRepo}
}

func (s *brandService) CreateBrand(brand *model.Brand) error {
	return s.brandRepo.CreateBrand(brand)
}

func (s *brandService) GetAllBrand() ([]model.Brand, error) {
	return s.brandRepo.GetAllBrand()
}

func (s *brandService) GetBrandByID(id uint) (*model.Brand, error) {
	return s.brandRepo.GetBrandByID(id)
}

func (s *brandService) UpdateBrand(brand *model.Brand) error {
	return s.brandRepo.UpdateBrand(brand)
}

func (s *brandService) DeleteBrand(brandID uint) error {
	return s.brandRepo.DeleteBrand(brandID)
}
func (s *brandService) AssociateCategoryFromBrand(brandID uint, categoryID uint) error {
	return s.brandRepo.AssociateCategoryFromBrand(brandID, categoryID)
}
func (s *brandService) RemoveCategoryFromBrand(brandID uint, categoryID uint) error {
	return s.brandRepo.RemoveCategoryFromBrand(brandID, categoryID)
}
