package main

import (
	"shop-server-order/infra"
	"shop-server-order/internal/api"
)

func main() {
	//init config
	i := infra.New("config/config.json")

	//init redis client
	redisClient := i.RedisClient()

	//Start api server
	api.NewServer(i, redisClient).Run()
}
