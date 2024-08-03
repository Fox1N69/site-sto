package handler

import (
	"fmt"
	"net/http"
	"shop-server-order/internal/models"
	"shop-server-order/utils/logger"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"github.com/goccy/go-json"
)

type Handler struct {
	bot *tgbotapi.BotAPI
	log logger.Logger
}

func NewHandler(bot *tgbotapi.BotAPI) *Handler {
	return &Handler{
		bot: bot,
		log: logger.GetLogger(),
	}
}

func (h *Handler) StartHandle(msg *tgbotapi.Message) {
	chatID := msg.Chat.ID

	helloText := "Добро пожаловать в бота для получения уведомления от интернет магазина Remzona"
	welcomMessage := tgbotapi.NewMessage(chatID, helloText)

	h.sendMessageWithButton(welcomMessage)
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

	switch callbackData {
	case "all_orders":
		h.GetAllOrdersHandle(update.CallbackQuery.Message)
	case "last_order":
		// Обработка нажатия на кнопку для последнего заказа
	default:
		// Дополнительная логика для других возможных значений callbackData
	}
}
