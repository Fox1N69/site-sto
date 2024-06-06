package handler

import (
	"server/internal/controller"
	"server/internal/repository"
	"server/internal/service"
)

type Handler struct {
	repository *repository.Repositorys
	Order      *OrderHandler
	User       *UserHandler
}

func NewHandlers(repo *repository.Repositorys, authController *controller.AuthController) *Handler {
	useService := service.NewServices(repo, authController)

	return &Handler{
		repository: repo,
		Order:      NewOrderHandler(repo, service.NewOrderService(repo.Order)),
		User:       NewUserHandler(useService),
	}
}
