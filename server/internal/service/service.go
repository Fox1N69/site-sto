package service

import (
	"server/internal/controller"
	"server/internal/repository"
)

type Services struct {
	repository *repository.Repositorys
	controller *controller.AuthController
	User       *UserService
}

func NewServices(repo *repository.Repositorys, controll *controller.AuthController) *Services {
	return &Services{
		repository: repo,
		controller: controll,
		User:       NewUserService(repo.User, controll),
	}
}
