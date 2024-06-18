package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type AutoService interface {
	GetAllModelAuto() ([]model.ModelAuto, error)
	GetModelAutoByBrandID(brandID uint) ([]model.ModelAuto, error)
}

type autoService struct {
	repo repo.AutoRepo
}

func NewAutoService(repo repo.AutoRepo) AutoService {
	return &autoService{repo: repo}
}

func (s *autoService) GetAllModelAuto() ([]model.ModelAuto, error) {
	return s.repo.GetAll()
}

func (s *autoService) GetModelAutoByBrandID(brandID uint) ([]model.ModelAuto, error) {
	return s.repo.GetByBrandID(brandID)
}
