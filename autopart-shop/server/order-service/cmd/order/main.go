package main

import (
	"shop-server-order/infra"
	"shop-server-order/internal/api"
	"shop-server-order/internal/models"
	"shop-server-order/utils/logger"
)

func main() {
	//init config
	i := infra.New("config/config.json")

	log := logger.GetLogger()

	//migrate table to database
	i.Migrate(&models.Order{}, &models.VinOrder{})
	log.Info("Database migrate success")

	//init redis client
	redisClient := i.RedisClient()

	//Start api server
	api.NewServer(i, redisClient).Run()
}
