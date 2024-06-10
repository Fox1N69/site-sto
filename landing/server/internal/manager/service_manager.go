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
		basketService = sm.repo.BasketRepo()
	})

	return basketService
}
