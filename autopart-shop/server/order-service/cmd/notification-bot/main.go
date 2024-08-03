package main

import (
	"shop-server-order/infra"
	"shop-server-order/notification-bot/bot"
	"shop-server-order/utils/logger"
)

func main() {
	// Init config
	i := infra.New("config/config.json")

	// Get custom logger
	log := logger.GetLogger()

	//Create new notification bot
	bot, err := bot.New(i.Config().Sub("bot").GetString("token"))
	if err != nil {
		log.Fatal(err)
	}

	// Start notification bot
	if err := bot.Start(); err != nil {
		log.Fatal(err)
	}

}
