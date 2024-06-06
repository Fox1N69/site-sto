package handler

import (
	"server/internal/repository"
)

type OrderHandler struct {
	repository *repository.Repositorys
}

func NewOrderHandler(repo *repository.Repositorys) *OrderHandler {
	return &OrderHandler{repository: repo}
}
