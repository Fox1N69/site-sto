package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type CategoryService interface {
	GetCategoryByID(id uint) (*model.Category, error)
	GetAllCategory() ([]model.Category, error)
	CreateCategory(newCategory *model.Category) error
	UpdateCategory(category *model.Category) error
	DeleteCategory(id uint) error
	AssociateCategoryToBrand(categoryID, brandID uint) error
	RemoveBrandFromCategory(categoryID, brandID uint) error
}

type categoryService struct {
	categoryRepo repo.CategoryRepo
}

func NewCategoryService(categoryRepo repo.CategoryRepo) CategoryService {
	return &categoryService{
		categoryRepo: categoryRepo,
	}
}

func (cs *categoryService) GetCategoryByID(id uint) (*model.Category, error) {
	return cs.categoryRepo.GetCategoryByID(id)
}

func (cs *categoryService) GetAllCategory() ([]model.Category, error) {
	return cs.categoryRepo.GetAll()
}

func (cs *categoryService) CreateCategory(newCategory *model.Category) error {
	return cs.categoryRepo.CreateCategory(newCategory)
}

func (cs *categoryService) UpdateCategory(category *model.Category) error {
	return cs.categoryRepo.UpdateCategory(category)
}

func (cs *categoryService) DeleteCategory(id uint) error {
	return cs.categoryRepo.DeleteCategory(id)
}

func (cs *categoryService) AssociateCategoryToBrand(categoryID, brandID uint) error {
	return cs.categoryRepo.AssociateCategoryToBrand(categoryID, brandID)
}

func (cs *categoryService) RemoveBrandFromCategory(categoryID, brandID uint) error {
	return cs.categoryRepo.RemoveBrandFromCategory(categoryID, brandID)
}
