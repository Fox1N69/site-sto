package handler

import (
	"server/internal/repository"
	"server/internal/service"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type OrderHandler struct {
	repository *repository.Repositorys
	service    *service.OrderService
}

func NewOrderHandler(repo *repository.Repositorys, service *service.OrderService) *OrderHandler {
	return &OrderHandler{repository: repo, service: service}
}

func (h *OrderHandler) CreateOrder(c *fiber.Ctx) error {
	customerID, err := strconv.ParseUint(c.Params("customerID"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Неверный идентификатор клиента"})
	}

	shopID, err := strconv.ParseUint(c.Params("shopID"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Неверный идентификатор магазина"})
	}

	totalAmount, err := strconv.ParseFloat(c.Params("totalAmount"), 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Неверная общая сумма"})
	}

	order, err := h.service.CreateOrder(uint(customerID), uint(shopID), totalAmount)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Ошибка создания заказа"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Заказ успешно создан", "order": order})
}
