package handler

import (
	"server/internal/repository"
)

type Handler struct {
	repository *repository.Repositorys
	Order      *OrderHandler
	User       *UserHandler
}

func NewHandlers(repo *repository.Repositorys) *Handler {

	return &Handler{
		repository: repo,
		Order:      NewOrderHandler(repo),
		User:       NewUserHandler(),
	}
}
