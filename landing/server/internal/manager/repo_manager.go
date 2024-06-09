package manager

import (
	"sync"

	"shop-server/infra"
	"shop-server/internal/repo"
)

type RepoManager interface {
	AuthRepo() repo.AuthRepo
	ShopRepo() repo.ShopRepo
}

type repoManager struct {
	infra infra.Infra
}

func NewRepoManager(infra infra.Infra) RepoManager {
	return &repoManager{infra: infra}
}

var (
	authRepoOnce sync.Once
	authRepo     repo.AuthRepo
	shopRepoOnce sync.Once
	shopRepo     repo.ShopRepo
)

func (rm *repoManager) ShopRepo() repo.ShopRepo {
	shopRepoOnce.Do(func() {
		shopRepo = repo.NewShopRepo(rm.infra.GormDB())
	})

	return shopRepo
}

func (rm *repoManager) AuthRepo() repo.AuthRepo {
	authRepoOnce.Do(func() {
		authRepo = repo.NewAuthRepo(rm.infra.GormDB())
	})

	return authRepo
}
