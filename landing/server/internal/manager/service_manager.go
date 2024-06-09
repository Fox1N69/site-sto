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
	authServiceOnce   sync.Once
	authService       service.AuthService
	autoPServiceOnece sync.Once
	autoPService      service.AutoPService
)

func (sm *serviceManager) AutoPService() service.AutoPService {
	autoPServiceOnece.Do(func() {
		autoPService = sm.repo.AutoPRepo()
	})

	return autoPService
}

func (sm *serviceManager) AuthService() service.AuthService {
	authServiceOnce.Do(func() {
		authService = sm.repo.AuthRepo()
	})

	return authService
}
