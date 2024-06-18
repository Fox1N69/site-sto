package service

import "shop-server/internal/repo"

type AutoService interface {
}

type autoService struct {
	repo repo.AutoRepo
}

func NewAutoService(repo repo.AutoRepo) AutoService {
	return &autoService{repo: repo}
}
