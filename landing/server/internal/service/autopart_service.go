package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type AutoPService interface {
	Create(product model.AutoPart) error
	GetAll() ([]model.AutoPart, error)
	GetSortedByPrice() ([]model.AutoPart, error)
}

type autoPService struct {
	autoPRepo repo.AutoPRepo
}

func NewAutoPService(autoPRepo repo.AutoPRepo) AutoPService {
	return &autoPService{
		autoPRepo: autoPRepo,
	}
}

func (s *autoPService) Create(product model.AutoPart) error {
	return s.autoPRepo.Create(product)
}

func (s *autoPService) GetAll() ([]model.AutoPart, error) {
	return s.autoPRepo.GetAll()
}

func (s *autoPService) GetSortedByPrice() ([]model.AutoPart, error) {
	return s.autoPRepo.GetSortedByPrice()
}
