package main

import (
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
		&model.AutoPart{},
		&model.BasketItem{},
		&model.AutoPartInfo{},
		&model.BrandCategory{},
		&model.Order{},
	)
	i.Migrate(&model.AutoPartCategory{})

	api.NewServer(i).Run()
}
