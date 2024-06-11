package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type AutoPartService interface {
	GetAllAutoParts() ([]model.AutoPart, error)
	GetAutoPartByID(id uint) (*model.AutoPart, error)
	UpdateAutoPart(autoPart *model.AutoPart) error
	DeleteAutoPart(id uint) error
	// Можете добавить дополнительные методы по необходимости
}

type autoPartService struct {
	autoPartRepo repo.AutoPartRepo
}

func NewAutoPartService(autoPartRepo repo.AutoPartRepo) AutoPartService {
	return &autoPartService{autoPartRepo: autoPartRepo}
}

func (s *autoPartService) GetAllAutoParts() ([]model.AutoPart, error) {
	return s.autoPartRepo.GetAll()
}

func (s *autoPartService) GetAutoPartByID(id uint) (*model.AutoPart, error) {
	return s.autoPartRepo.GetByID(id)
}

func (s *autoPartService) CreateAutoPart(autoPart *model.AutoPart) error {
	return s.autoPartRepo.Create(*autoPart)
}

func (s *autoPartService) UpdateAutoPart(autoPart *model.AutoPart) error {
	return s.autoPartRepo.Update(*autoPart)
}

func (s *autoPartService) DeleteAutoPart(id uint) error {
	return s.autoPartRepo.Delete(id)
}
