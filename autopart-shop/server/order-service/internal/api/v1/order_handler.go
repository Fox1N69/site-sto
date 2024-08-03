package v1

import (
	"shop-server-order/common/http/response"
	"shop-server-order/internal/models"
	"shop-server-order/internal/service"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v3"
)

type OrderHandler interface {
	CreateOrder(c fiber.Ctx) error
	CreateVinOrder(c fiber.Ctx) error
	GetAllOrders(c fiber.Ctx) error
}

type orderHandler struct {
	service service.OrderService
}

func NewOrderHandler(orderService service.OrderService) OrderHandler {
	return &orderHandler{
		service: orderService,
	}
}

func (h *orderHandler) CreateOrder(c fiber.Ctx) error {
	response := response.New(c)

	var order models.Order
	if err := json.Unmarshal(c.Body(), &order); err != nil {
		response.Error(404, err)
		return err
	}

	id, err := h.service.CreateOrder(order)
	if err != nil {
		response.Error(501, err)
		return err
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "order create success",
		"id":      id,
	})
}

func (h *orderHandler) CreateVinOrder(c fiber.Ctx) error {
	response := response.New(c)

	var vinOrder models.VinOrder
	if err := json.Unmarshal(c.Body(), &vinOrder); err != nil {
		response.Error(404, err)
		return err
	}

	order, err := h.service.CreateVinOrder(vinOrder)
	if err != nil {
		response.Error(501, err)
		return err
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "create order by vin success",
		"order":   order,
	})
}

func (h *orderHandler) GetAllOrders(c fiber.Ctx) error {
	response := response.New(c)

	orders, err := h.service.GetAllOrders()
	if err != nil {
		response.Error(404, err)
		return err
	}

	return c.Status(200).JSON(&orders)
}
