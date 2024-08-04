package handler

import (
	"fmt"
	"net/http"
	"shop-server-order/internal/models"
	"shop-server-order/notification-bot/repository"
	"shop-server-order/utils/logger"
	"strconv"
	"strings"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"github.com/goccy/go-json"
)

type Handler struct {
	bot  *tgbotapi.BotAPI
	log  logger.Logger
	repo *repository.BotRepo
}

func NewHandler(bot *tgbotapi.BotAPI, repository *repository.BotRepo) *Handler {
	return &Handler{
		bot:  bot,
		log:  logger.GetLogger(),
		repo: repository,
	}
}

func (h *Handler) StartHandle(msg *tgbotapi.Message) {
	chatID := msg.Chat.ID

	user := models.NotificationUser{
		ID:        int64(msg.From.ID),
		FirstName: msg.From.FirstName,
		Username:  msg.From.UserName,
		Type:      msg.Chat.Type,
		CreatedAt: time.Now(),
		ChatID:    chatID,
	}

	if err := h.repo.Save(&user); err != nil {
		h.log.Errorf("Failed save the user to database: %v", err)
	}

	helloText := "Добро пожаловать в бота для получения уведомления от интернет магазина Remzona"
	welcomMessage := tgbotapi.NewMessage(chatID, helloText)

	h.sendMessageWithButton(welcomMessage)

	// Сообщение с chat_id
	chatIDMessage := fmt.Sprintf("Ваш chat ID: %d", chatID)
	chatIDMsg := tgbotapi.NewMessage(chatID, chatIDMessage)

	// Отправка сообщения с chat_id
	if _, err := h.bot.Send(chatIDMsg); err != nil {
		h.log.Errorf("Failed to send chat ID message: %v", err)
	}
}

func (h *Handler) sendMessageWithButton(message tgbotapi.MessageConfig) {
	inlineKb := tgbotapi.NewInlineKeyboardMarkup(
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("Все заказы", "all_orders"),
			tgbotapi.NewInlineKeyboardButtonData("Последний заказ", "last_order"),
		),
	)

	message.ReplyMarkup = inlineKb

	_, err := h.bot.Send(message)
	if err != nil {
		h.log.Errorf("Failed to send hello message: %v", err)
	}
}

func (h *Handler) getAllVinOrdersFromService() ([]models.VinOrder, error) {
	// Отправляем GET запрос к вашему сервису для получения всех заказов
	resp, err := http.Get("http://localhost:4000/api/order")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var orders []models.VinOrder
	err = json.NewDecoder(resp.Body).Decode(&orders)
	if err != nil {
		return nil, err
	}

	return orders, nil
}

func (h *Handler) GetAllOrdersHandle(msg *tgbotapi.Message) {
	orders, err := h.getAllVinOrdersFromService()
	if err != nil {
		h.log.Errorf("Failed to get all order from the order service: %v", err)
	}

	var ordersText string
	for _, order := range orders {
		ordersText += fmt.Sprintf("ID: %d\nVin: %s\nPart: %s\nAuto: %s\nModel: %s\nOrder ID: %d\n\n", order.ID, order.VinNumber, order.PartName, order.Auto, order.ModelAuto, order.OrderID)
	}

	chatID := msg.Chat.ID
	respMsg := tgbotapi.NewMessage(chatID, ordersText)

	h.sendMessageWithButton(respMsg)
}

func (h *Handler) CallBackHandle(update tgbotapi.Update) {
	if update.CallbackQuery == nil {
		h.log.Error("Received nil CallbackQuery in CallBackHandle")
		return
	}

	callbackData := update.CallbackQuery.Data
	chatID := update.CallbackQuery.Message.Chat.ID

	switch {
	case callbackData == "all_orders":
		h.GetAllOrdersHandle(update.CallbackQuery.Message)
	case callbackData == "last_order":
		// Обработка нажатия на кнопку для последнего заказа
	case strings.HasPrefix(callbackData, "show_order_"):
		// Получаем ID заказа из callbackData
		orderIDStr := strings.TrimPrefix(callbackData, "show_order_")
		orderID, err := strconv.ParseUint(orderIDStr, 10, 64)
		if err != nil {
			h.log.Errorf("Failed to parse order ID: %v", err)
			return
		}
		h.GetOrderDetailsHandle(chatID, uint(orderID))
	default:
		// Дополнительная логика для других возможных значений callbackData
	}
}

func (h *Handler) GetOrderDetailsHandle(chatID int64, orderID uint) {
	// Получаем полный заказ и связанные VinOrder
	order, err := h.repo.GetOrderWithVinOrders(orderID)
	if err != nil {
		h.log.Errorf("Failed to get order details: %v", err)
		return
	}

	// Формируем сообщение с полными данными о заказе
	message := fmt.Sprintf("Детали заказа:\n\n"+
		"Order ID: %d\n"+
		"Status: %s\n"+
		"Email: %s\n"+
		"Phone Number: %s\n"+
		"Delivery City: %s\n"+
		"Delivery Address: %s\n"+
		"Delivery Cost: %.2f\n"+
		"Payment Method: %s\n"+
		"Comment: %s\n"+
		"Tracking Number: %s\n\n"+
		"Vin Orders:\n",
		order.ID,
		order.Status,
		order.Email,
		order.PhoneNumber,
		order.DeliveryCity,
		order.DeliveryAddress,
		order.DeliveryCost,
		order.PaymentMethod,
		order.Comment,
		order.TrackingNumber,
	)

	for _, vinOrder := range order.VinOrder {
		message += fmt.Sprintf("ID: %d\nVin: %s\nPart: %s\nAuto: %s\nModel: %s\n\n", vinOrder.ID, vinOrder.VinNumber, vinOrder.PartName, vinOrder.Auto, vinOrder.ModelAuto)
	}

	respMsg := tgbotapi.NewMessage(chatID, message)
	_, err = h.bot.Send(respMsg)
	if err != nil {
		h.log.Errorf("Failed to send order details message: %v", err)
	}
}
