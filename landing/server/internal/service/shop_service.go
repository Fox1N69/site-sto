package service

import "shop-server/internal/repo"

type ShopService interface {
}

type shopService struct {
	shopRepo repo.ShopRepo
}

func NewShopService(shopRepo repo.ShopRepo) ShopService {
	return &shopService{
		shopRepo: shopRepo,
	}
}
