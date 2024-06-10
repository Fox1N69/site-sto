package manager

import (
	"sync"

	"shop-server/infra"
	"shop-server/internal/repo"
)

type RepoManager interface {
	AuthRepo() repo.AuthRepo
	AutoPRepo() repo.AutoPRepo
	BasketRepo() repo.BasketRepo
}

type repoManager struct {
	infra infra.Infra
}

func NewRepoManager(infra infra.Infra) RepoManager {
	return &repoManager{infra: infra}
}

var (
	authRepoOnce   sync.Once
	authRepo       repo.AuthRepo
	autoPRepoOnce  sync.Once
	autoPRepo      repo.AutoPRepo
	basketRepoOnce sync.Once
	basketRepo     repo.BasketRepo
)

func (rm *repoManager) AutoPRepo() repo.AutoPRepo {
	autoPRepoOnce.Do(func() {
		autoPRepo = repo.NewAutoPRepo(rm.infra.GormDB())
	})

	return autoPRepo
}

func (rm *repoManager) AuthRepo() repo.AuthRepo {
	authRepoOnce.Do(func() {
		authRepo = repo.NewAuthRepo(rm.infra.GormDB())
	})

	return authRepo
}

func (rm *repoManager) BasketRepo() repo.BasketRepo {
	basketRepoOnce.Do(func() {
		basketRepo = repo.NewBasketRepo(rm.infra.GormDB())
	})

	return basketRepo
}
