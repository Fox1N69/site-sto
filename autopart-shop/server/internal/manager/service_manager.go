package manager

import (
	"sync"

	"shop-server/infra"
	"shop-server/internal/service"
)

type ServiceManager interface {
	AuthService() service.AuthService
	AutoPartService() service.AutoPartService
	BasketService() service.BasketService
	CategoryService() service.CategoryService
	BrandService() service.BrandService
	Blacklist() service.BlacklistService
	AutoService() service.AutoService
	OrderService() service.OrderService
}

type serviceManager struct {
	infra infra.Infra
	repo  RepoManager
}

func NewServiceManager(infra infra.Infra) ServiceManager {
	return &serviceManager{
		infra: infra,
		repo:  NewRepoManager(infra),
	}
}

var (
	authServiceOnce sync.Once
	authService     service.AuthService

	autoPartServiceOnece sync.Once
	autoPartService      service.AutoPartService

	basketServiceOnce sync.Once
	basketService     service.BasketService

	categoryServiceOnce sync.Once
	categoryService     service.CategoryService

	brandServiceOnce sync.Once
	brandService     service.BrandService

	blacklistServiceOnce sync.Once
	blacklistService     service.BlacklistService

	autoServiceOnce sync.Once
	autoService     service.AutoService

	orderServiceOnce sync.Once
	orderService     service.OrderService
)

func (sm *serviceManager) AutoPartService() service.AutoPartService {
	autoPartServiceOnece.Do(func() {
		autoPartRepo := sm.repo.AutoPartRepo()                     // Получаем экземпляр репозитория
		autoPartService = service.NewAutoPartService(autoPartRepo) // Используем его для создания сервиса
	})

	return autoPartService
}

func (sm *serviceManager) AuthService() service.AuthService {
	authServiceOnce.Do(func() {
		authService = sm.repo.AuthRepo()
	})

	return authService
}

func (sm *serviceManager) BasketService() service.BasketService {
	basketServiceOnce.Do(func() {
		basketRepo = sm.repo.BasketRepo()
		basketService = service.NewBasketService(basketRepo, autoPartRepo)
	})

	return basketService
}

func (sm *serviceManager) CategoryService() service.CategoryService {
	categoryServiceOnce.Do(func() {
		categoryRepo = sm.repo.CategoryRepo()
		categoryService = service.NewCategoryService(categoryRepo)
	})

	return categoryService
}

func (sm *serviceManager) BrandService() service.BrandService {
	brandServiceOnce.Do(func() {
		brandRepo = sm.repo.BrandRepo()
		brandService = service.NewBrandService(brandRepo)
	})

	return brandService
}

func (sm *serviceManager) Blacklist() service.BlacklistService {
	blacklistServiceOnce.Do(func() {
		blacklistService = service.NewBlacklistService()
	})

	return blacklistService
}

func (sm *serviceManager) AutoService() service.AutoService {
	autoServiceOnce.Do(func() {
		autoService = service.NewAutoService(sm.repo.AutoRepo())
	})

	return autoService
}

func (sm *serviceManager) OrderService() service.OrderService {
	orderServiceOnce.Do(func() {
		orderService = service.NewOrderService(sm.repo.OrderRepo())
	})
	return orderService
}
