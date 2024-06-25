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
	CategoryRepo() repo.CategoryRepo
	BrandRepo() repo.BrandRepo
	AutoRepo() repo.AutoRepo
	OrderRepo() repo.OrderRepo
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

	autoPartRepoOnce sync.Once
	autoPartRepo     repo.AutoPartRepo

	basketRepoOnce sync.Once
	basketRepo     repo.BasketRepo

	categoryRepoOnce sync.Once
	categoryRepo     repo.CategoryRepo

	brandRepoOnce sync.Once
	brandRepo     repo.BrandRepo

	autoRepoOnce sync.Once
	autoRepo     repo.AutoRepo

	orderRepoOnce sync.Once
	orderRepo     repo.OrderRepo
)

func (rm *repoManager) AutoPartRepo() repo.AutoPartRepo {
	autoPartRepoOnce.Do(func() {
		autoPartRepo = repo.NewAutoPartRepo(rm.infra.GormDB(), rm.infra.RedisClient())
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

func (rm *repoManager) CategoryRepo() repo.CategoryRepo {
	categoryRepoOnce.Do(func() {
		categoryRepo = repo.NewCategoryRepo(rm.infra.GormDB())
	})
	return categoryRepo
}

func (rm *repoManager) BrandRepo() repo.BrandRepo {
	brandRepoOnce.Do(func() {
		brandRepo = repo.NewBrandRepo(rm.infra.GormDB())
	})
	return brandRepo
}

func (rm *repoManager) AutoRepo() repo.AutoRepo {
	autoRepoOnce.Do(func() {
		autoRepo = repo.NewAutoRepo(rm.infra.GormDB())
	})
	return autoRepo
}

func (rm *repoManager) OrderRepo() repo.OrderRepo {
	orderRepoOnce.Do(func() {
		orderRepo = repo.NewOrderRepo(rm.infra.GormDB())
	})
	return orderRepo
}
