package manager

import (
	"sync"

	"shop-server/infra"
	"shop-server/internal/repo"
)

type RepoManager interface {
	AuthRepo() repo.AuthRepo
	AutoPartRepo() repo.AutoPartRepo
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
	autoPartRepoOnce  sync.Once
	autoPartRepo      repo.AutoPartRepo
	basketRepoOnce sync.Once
	basketRepo     repo.BasketRepo
)

func (rm *repoManager) AutoPartRepo() repo.AutoPartRepo {
	autoPartRepoOnce.Do(func() {
		autoPartRepo = repo.NewAutoPartRepo(rm.infra.GormDB())
	})

	return autoPartRepo
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
