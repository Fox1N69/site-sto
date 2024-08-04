package v1

import (
	"fmt"
	"shop-server-order/common/http/response"
	"shop-server-order/internal/client"
	"shop-server-order/internal/models"
	"shop-server-order/internal/service"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v3"
	"github.com/sirupsen/logrus"
)

type OrderHandler interface {
	CreateOrder(c fiber.Ctx) error
	CreateVinOrder(c fiber.Ctx) error
	GetAllOrders(c fiber.Ctx) error
}

type orderHandler struct {
	service        service.OrderService
	telegramClient *client.TelegramClient
}

func NewOrderHandler(orderService service.OrderService, telegramClient *client.TelegramClient) OrderHandler {
	return &orderHandler{
		service:        orderService,
		telegramClient: telegramClient,
	}
}

func (h *orderHandler) CreateOrder(c fiber.Ctx) error {
	response := response.New(c)

	type CreateOrderRequest struct {
		Order    models.Order      `json:"order"`
		VinOrder []models.VinOrder `json:"vin_order"`
	}

	var request CreateOrderRequest
	if err := json.Unmarshal(c.Body(), &request); err != nil {
		response.Error(fiber.StatusBadRequest, fmt.Errorf("invalid request body: %v", err))
		return err
	}

	// Вызов сервиса для создания заказа с запчастями
	order, err := h.service.CreateOrderWithVinOrder(request.Order, request.VinOrder)
	if err != nil {
		response.Error(fiber.StatusInternalServerError, fmt.Errorf("failed to create order: %v", err))
		return err
	}

	// Получаем все chatIDs
	chatIDs, err := h.service.GetAllBotChatIDs()
	if err != nil {
		response.Error(fiber.StatusInternalServerError, fmt.Errorf("failed to get bot chat IDs: %v", err))
		return err
	}

	// Формируем сообщение только с VinOrder
	var vinOrderMessages string
	for _, vinOrder := range request.VinOrder {
		vinOrderMessages += fmt.Sprintf("ID: %d\nVin: %s\nPart: %s\nAuto: %s\nModel: %s\n\n", vinOrder.ID, vinOrder.VinNumber, vinOrder.PartName, vinOrder.Auto, vinOrder.ModelAuto)
	}

	message := fmt.Sprintf("Новый заказ создан!\n\n"+
		"Вин Заказы:\n%s", vinOrderMessages)

	orderURL := fmt.Sprintf("http://example.com/order/%d", order.ID)
	// Отправляем сообщение всем chatIDs
	for _, chatID := range chatIDs {
		if err := h.telegramClient.SendMessage(chatID, message, orderURL, order.ID); err != nil {
			logrus.Errorf("Failed to send Telegram message: %v", err)
		}
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Order created successfully",
		"order":   order,
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

	chatIDs, err := h.service.GetAllBotChatIDs()
	if err != nil {
		response.Error(501, err)
		return err
	}

	for _, chatID := range chatIDs {
		message := fmt.Sprintf("Новый заказ создан!\nID: %d\nPart: %s\nAuto: %s\nModelAuto: %s", order.ID, order.PartName, order.Auto, order.ModelAuto)
		orderUrl := fmt.Sprintf("https://google.com/%d", order.ID)
		if err := h.telegramClient.SendMessage(int64(chatID), message, orderUrl, order.ID); err != nil {
			logrus.Errorf("Failed to send Telegram message: %v", err)
		}
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
