package handler

import (
	"server/internal/repository"
	"server/internal/service"
)

type Handler struct {
	repository *repository.Repositorys
	Order      *OrderHandler
}

func NewHandlers(repo *repository.Repositorys) *Handler {
	return &Handler{
		repository: repo,
		Order:      NewOrderHandler(repo, service.NewOrderService(repo.Order)),
	}
}

