package service

import (
	"shop-server/internal/repo"
)

type AutoPService interface {
}

type autoPService struct {
	autoPRepo repo.AutoPRepo
}

func NewAutoPService(autoPRepo repo.AutoPRepo) AutoPService {
	return &autoPService{
		autoPRepo: autoPRepo,
	}
}
