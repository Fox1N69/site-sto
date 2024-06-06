package service

import (
	"errors"
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

func (s *UserService) Registration(user models.User) (*models.User, error) {
	existingUser, err := s.repository.FindByEmail(user.Email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("user with this email already exists")
	}

	// Хэширование пароля
	hashedPassword, err := s.controller.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}

	// Создание нового пользователя с хэшированным паролем
	newUser := &models.User{
		UserID:   user.UserID,
		Email:    user.Email,
		Password: hashedPassword,
		// Другие данные пользователя
		Username:       user.Username,
		IsActivated:    user.IsActivated,
		ActivationLink: user.ActivationLink,
		FullName:       user.FullName,
		DateOfBirth:    user.DateOfBirth,
		Location:       user.Location,
		Role:           user.Role,
		Permissions:    user.Permissions,
	}

	// Сохранение пользователя в базе данных
	if err := s.repository.Create(newUser); err != nil {
		return nil, err
	}

	return newUser, nil
}
