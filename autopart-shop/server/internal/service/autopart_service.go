package service

import (
	"errors"
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type AutoPartService interface {
	CreateAutoPart(autoPart *model.AutoPart) error
	GetAllAutoParts() ([]model.AutoPart, error)
	GetAutoPartByID(id uint) (*model.AutoPart, error)
	UpdateAutoPart(product model.AutoPart, fieldsToUpdate map[string]interface{}) error
	DeleteAutoPart(id uint) error
	CheckStock(id uint) (int, error)
	ReduceStock(id uint, quantity int) error
	Search(query string) ([]model.AutoPart, error)
}

type autoPartService struct {
	autoPartRepo repo.AutoPartRepo
}

func NewAutoPartService(autoPartRepo repo.AutoPartRepo) AutoPartService {
	return &autoPartService{autoPartRepo: autoPartRepo}
}

func (s *autoPartService) CreateAutoPart(autoPart *model.AutoPart) error {
	return s.autoPartRepo.Create(autoPart)
}

func (s *autoPartService) GetAllAutoParts() ([]model.AutoPart, error) {
	return s.autoPartRepo.GetAll()
}

func (s *autoPartService) GetAutoPartByID(id uint) (*model.AutoPart, error) {
	return s.autoPartRepo.GetByID(id)
}

func (s *autoPartService) UpdateAutoPart(product model.AutoPart, fieldsToUpdate map[string]interface{}) error {
	return s.autoPartRepo.Update(product, fieldsToUpdate)
}

func (s *autoPartService) DeleteAutoPart(id uint) error {
	return s.autoPartRepo.Delete(id)
}

func (s *autoPartService) CheckStock(id uint) (int, error) {
	stock, err := s.autoPartRepo.GetStock(id)
	if err != nil {
		return 0, err
	}
	if stock > 0 {
		return int(stock), nil
	}

	return int(stock), nil
}

func (s *autoPartService) ReduceStock(id uint, quantity int) error {
	stock, err := s.autoPartRepo.GetStock(id)
	if err != nil {
		return err
	}
	stockUint := uint(stock) // Преобразование типа int в uint
	if stockUint < uint(quantity) {
		return errors.New("not enough stock")
	}
	newStock := int(stockUint - uint(quantity)) // Преобразование обратно в int
	return s.autoPartRepo.UpdateStock(id, newStock)
}

func (s *autoPartService) Search(query string) ([]model.AutoPart, error) {
	return s.autoPartRepo.Search(query)
}
