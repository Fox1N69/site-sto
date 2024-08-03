package main

import (
	"shop-server-order/infra"
	"shop-server-order/internal/api"
	"shop-server-order/internal/models"
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
}
