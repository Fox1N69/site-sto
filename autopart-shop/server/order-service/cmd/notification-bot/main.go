package main

import (
	"shop-server-order/infra"
	"shop-server-order/notification-bot/bot"
	"shop-server-order/utils/logger"
)

func main() {
	i := infra.New("config/config.json")

	log := logger.GetLogger()

	bot, err := bot.New(i.Config().Sub("bot").GetString("token"))
	if err != nil {
		log.Fatal(err)
	}

	if err := bot.Start(); err != nil {
		log.Fatal(err)
	}

}
