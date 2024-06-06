package service

import "server/internal/repository"

type Services struct {
	repository *repository.Repositorys
	User       *UserService
}

func NewServices(repo *repository.Repositorys) *Services {
	return &Services{
		repository: repo,
		User:       NewUserService(repo.User),
	}
}
