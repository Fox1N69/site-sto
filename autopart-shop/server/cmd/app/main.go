package main

import (
	_ "net/http/pprof"
	"shop-server/cmd/api"
	"shop-server/infra"
	"shop-server/internal/model"
)

func main() {
	i := infra.New("config/config.json")
	i.SetMode()
	i.Migrate(
		&model.User{},
		&model.User{},
		&model.Category{},
		&model.Brand{},
		&model.Basket{},
		&model.ModelAuto{},
		&model.AutoPart{},
		&model.BasketItem{},
		&model.AutoPartInfo{},
		&model.BrandCategory{},
		&model.Order{},
		&model.VinOrder{},
	)
	i.Migrate(&model.AutoPartCategory{})

	redisClient := i.RedisClient()

	api.NewServer(i, redisClient).Run()
}
