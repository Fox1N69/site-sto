package manager

import (
	"sync"

	"shop-server/infra"
	"shop-server/internal/service"
)

type ServiceManager interface {
	AuthService() service.AuthService
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
	authServiceOnce  sync.Once
	authService      service.AuthService
	shopServiceOnece sync.Once
	shopService      service.ShopService
)

func (sm *serviceManager) ShopService() service.ShopService {
	shopServiceOnece.Do(func() {
		shopService = sm.repo.ShopRepo()
	})

	return shopService
}

func (sm *serviceManager) AuthService() service.AuthService {
	authServiceOnce.Do(func() {
		authService = sm.repo.AuthRepo()
	})

	return authService
}
