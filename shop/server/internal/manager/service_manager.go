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
		basketService = service.NewBasketService(basketRepo)
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
