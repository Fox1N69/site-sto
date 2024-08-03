package handler

import (
	"shop-server-order/utils/logger"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
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

	h.getInlineButton(welcomMessage)
}

func (h *Handler) getInlineButton(message tgbotapi.MessageConfig) {
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

func (h *Handler) CallBackHandle(msg *tgbotapi.Message) {
	if msg.IsCommand() {
		switch msg.Command() {
		case "all_orders":
		case "last_order":
		default:
		}
	}
}
