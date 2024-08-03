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
