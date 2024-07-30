package manager

import (
	"shop-server-order/infra"
	"shop-server-order/internal/repo"
	"sync"
)

type RepoManager interface {
	OrderRepo() repo.OrderRepo
}

type repoManager struct {
	infra infra.Infra
}

func NewRepoManager(infra infra.Infra) RepoManager {
	return &repoManager{infra: infra}
}

var (
	orderRepoOnce sync.Once
	orderRepo     repo.OrderRepo
)

func (rm *repoManager) OrderRepo() repo.OrderRepo {
	orderRepoOnce.Do(func() {
		orderRepo = repo.NewOrderRepo(rm.infra.GormDB())
	})
	return orderRepo
}
