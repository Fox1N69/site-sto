package service

import (
	"encoding/json"
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type AutoService interface {
	CreateModelAuto(auto *model.ModelAuto) error
	AddModelAutoToChannel() <-chan model.ModelAuto
	DeleteModelFromChannel() <-chan uint
	GetAllModelAuto() ([]model.ModelAuto, error)
	GetModelAutoByBrandID(brandID uint) ([]model.ModelAuto, error)
	DeleteModelAuto(id uint) error
	UpdateModelAuto(id uint, name string, imgUrl string, brandID uint, releaseYear json.RawMessage) error
	SearchModelAutoByAllParams(query string) ([]model.ModelAuto, error)
}

type autoService struct {
	repo              repo.AutoRepo
	AddToChannel      chan model.ModelAuto
	DeleteFromCnannel chan uint
}

func NewAutoService(repo repo.AutoRepo) AutoService {
	return &autoService{repo: repo, AddToChannel: make(chan model.ModelAuto), DeleteFromCnannel: make(chan uint)}
}

func (s *autoService) CreateModelAuto(auto *model.ModelAuto) error {
	err := s.repo.Create(auto)
	if err == nil {
		s.AddToChannel <- *auto
	}
	return err
}

func (s *autoService) AddModelAutoToChannel() <-chan model.ModelAuto {
	return s.AddToChannel
}

func (s *autoService) GetAllModelAuto() ([]model.ModelAuto, error) {
	return s.repo.GetAll()
}

func (s *autoService) GetModelAutoByBrandID(brandID uint) ([]model.ModelAuto, error) {
	return s.repo.GetByBrandID(brandID)
}

func (s *autoService) DeleteModelAuto(id uint) error {
	err := s.repo.Delete(id)
	if err == nil {
		s.DeleteFromCnannel <- id
	}
	return nil
}

func (s *autoService) DeleteModelFromChannel() <-chan uint {
	return s.DeleteFromCnannel
}

func (s *autoService) UpdateModelAuto(id uint, name string, imgUrl string, brandID uint, releaseYear json.RawMessage) error {
	auto, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	auto.Name = name
	auto.Image = imgUrl
	auto.BrandID = brandID
	auto.ReleaseYear = releaseYear

	return s.repo.Update(auto)
}

func (s *autoService) SearchModelAutoByAllParams(query string) ([]model.ModelAuto, error) {
	return s.repo.SearchModelAuto(query)
}
