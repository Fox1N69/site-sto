package v1

import (
	"shop-server/infra"
	"shop-server/internal/service"
)

type ShopHandler interface {
}

type shopHandler struct {
	basketService service.BasketService
	infra         infra.Infra
}

func NewShopHandler(basketService service.BasketService, infra infra.Infra) ShopHandler {
	return &shopHandler{
		basketService: basketService,
		infra:         infra,
	}
}
