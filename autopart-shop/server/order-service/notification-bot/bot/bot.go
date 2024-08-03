package bot

import (
	"shop-server-order/notification-bot/handler"
	"shop-server-order/utils/logger"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

type Bot interface {
	Start() error
}

type bot struct {
	handle *handler.Handler
	log    logger.Logger
	token  string
	api    *tgbotapi.BotAPI
	chats  map[int64]bool
}

func New(token string) (Bot, error) {
	botAPI, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		return nil, err
	}
	botAPI.Debug = true

	handler := handler.NewHandler(botAPI)

	return &bot{
		log:    logger.GetLogger(),
		token:  token,
		api:    botAPI,
		chats:  make(map[int64]bool),
		handle: handler,
	}, nil
}

func (b *bot) Start() error {
	b.log.Info("Bot started")
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := b.api.GetUpdatesChan(u)
	if err != nil {
		return err
	}

	for update := range updates {
		if update.Message != nil {
			if update.Message.IsCommand() {
				switch update.Message.Command() {
				case "start":
					b.handle.StartHandle(update.Message)
				case "all_orders":
					b.handle.GetAllOrdersHandle(update.Message)
				default:
				}
			}
		} else if update.CallbackQuery != nil { // Incoming callback
			b.handle.CallBackHandle(update)
		}
	}

	return nil
}
