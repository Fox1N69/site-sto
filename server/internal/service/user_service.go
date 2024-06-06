package service

import "server/internal/repository"

type UserService struct {
	repository *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		repository: repo,
	}
}
