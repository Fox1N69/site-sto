package service

import (
	"server/internal/controller"
	"server/internal/models"
	"server/internal/repository"
)

type UserService struct {
	repository *repository.UserRepository
	controller *controller.AuthController
}

func NewUserService(repo *repository.UserRepository, controll *controller.AuthController) *UserService {
	return &UserService{
		repository: repo,
		controller: controll,
	}
}

func (s *UserService) Registration(email string, password []byte) (*models.User, error) {
	//Проверка пользователя по email
	s.repository.FindByEmail(email)
	s.controller.HashPassword(password)

	//Создание нового пользователя
	newUser := &models.User{
		Email:    email,
		Password: password,
	}

	//Сохранить пользователя в бд
	if err := s.repository.Create(newUser); err != nil {
		return nil, err
	}

	return newUser, nil
}
