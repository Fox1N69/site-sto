package service

import (
	"net/http"
	"server/internal/models"
	"server/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type OrderService struct {
	repository *repository.OrderRepository
}

func NewOrderService(repo *repository.OrderRepository) *OrderService {
	return &OrderService{
		repository: repo,
	}
}

func (s *OrderService) CreateOrder(c *fiber.Ctx) error {
	order := new(models.Order)

	if err := c.BodyParser(order); err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	if err := s.repository.CreateOrder(order); err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"message": "Order created successfully",
		"order":   "order",
	})
}
