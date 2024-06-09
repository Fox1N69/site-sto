package main

import (
	"authentication/api"
	"authentication/infra"
	"authentication/model"
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
	)

	api.NewServer(i).Run()
}
