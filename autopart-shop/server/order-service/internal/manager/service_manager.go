package manager

import (
	"sync"

	"shop-server/infra"
	"shop-server/internal/service"
)

type ServiceManager interface {
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
	orderServiceOnce sync.Once
	orderService     service.OrderService
)

func (sm *serviceManager) OrderService() service.OrderService {
	orderServiceOnce.Do(func() {
		orderService = service.NewOrderService(sm.repo.OrderRepo())
	})
	return orderService
}
