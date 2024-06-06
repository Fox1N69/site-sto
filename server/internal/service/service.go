package service

import "server/internal/repository"

type Services struct {
	repository *repository.Repositorys
}

func NewServices(repo *repository.Repositorys) *Services {
	return &Services{
		repository: repo,
	}
}
