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
	helloMessage := tgbotapi.NewMessage(chatID, helloText)

	_, err := h.bot.Send(helloMessage)
	if err != nil {
		h.log.Errorf("Failed to send hello message: %v", err)
	}
}

func (h *Handler) CallBackHandle(msg *tgbotapi.Message) {

}
