package manager

import (
	"sync"

	"shop-server/infra"
	"shop-server/internal/repo"
)

type RepoManager interface {
	AuthRepo() repo.AuthRepo
	AutoPRepo() repo.AutoPRepo
}

type repoManager struct {
	infra infra.Infra
}

func NewRepoManager(infra infra.Infra) RepoManager {
	return &repoManager{infra: infra}
}

var (
	authRepoOnce  sync.Once
	authRepo      repo.AuthRepo
	autoPRepoOnce sync.Once
	autoPRepo     repo.AutoPRepo
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
