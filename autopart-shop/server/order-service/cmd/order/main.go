package main

import (
	"shop-server-order/infra"
	"shop-server-order/internal/api"
	"shop-server-order/internal/models"
	"shop-server-order/notification-bot/bot"

	"github.com/sirupsen/logrus"
)

func main() {
	//init config
	i := infra.New("config/config.json")

	//migrate table to database
	i.Migrate(&models.Order{}, &models.VinOrder{})

	//init redis client
	redisClient := i.RedisClient()

	//Start api server
	api.NewServer(i, redisClient).Run()

	bot, err := bot.New("")
	if err != nil {
		logrus.Fatal(err)
	}

	if err := bot.Start(); err != nil {
		logrus.Fatal(err)
	}
}
