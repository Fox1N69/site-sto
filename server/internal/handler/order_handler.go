package handler

import (
	"net/http"
	"server/internal/models"
	"server/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type OrderHandler struct {
	repository *repository.Repositorys
}

func NewOrderHandler(repo *repository.Repositorys) *OrderHandler {
	return &OrderHandler{repository: repo}
}

func (h *OrderHandler) CreateOrder(c *fiber.Ctx) error {
	order := new(models.Order)

	if err := c.BodyParser(order); err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	if err := h.repository.Order.CreateOrder(order); err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"message": "Order created successfully",
		"order":   "order",
	})
}
