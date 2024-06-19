package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type AutoService interface {
	CreateModelAuto(auto *model.ModelAuto) error
	GetAllModelAuto() ([]model.ModelAuto, error)
	GetModelAutoByBrandID(brandID uint) ([]model.ModelAuto, error)
	DeleteModelAuto(id uint) error
}

type autoService struct {
	repo repo.AutoRepo
}

func NewAutoService(repo repo.AutoRepo) AutoService {
	return &autoService{repo: repo}
}

func (s *autoService) CreateModelAuto(auto *model.ModelAuto) error {
	return s.repo.Create(auto)
}
func (s *autoService) GetAllModelAuto() ([]model.ModelAuto, error) {
	return s.repo.GetAll()
}

func (s *autoService) GetModelAutoByBrandID(brandID uint) ([]model.ModelAuto, error) {
	return s.repo.GetByBrandID(brandID)
}

func (s *autoService) DeleteModelAuto(id uint) error {
	return s.repo.Delete(id)
}
