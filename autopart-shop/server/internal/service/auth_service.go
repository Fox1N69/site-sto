package service

import (
	"shop-server/internal/model"
	"shop-server/internal/repo"
)

type AuthService interface {
	CheckUsername(username string) bool
	Register(user *model.User) error
	Login(username string) (string, error)
	CheckID(id int) bool
	Delete(id int) error
	GetUserByID(id uint) (*model.User, error)
	GetUserByUsername(username string) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
	SaveRecoveryTokenToDB(user *model.User, token string) error
}

type authService struct {
	authRepo repo.AuthRepo
}

func NewAuthService(authRepo repo.AuthRepo) AuthService {
	return &authService{authRepo: authRepo}
}

func (s *authService) GetUserByUsername(username string) (*model.User, error) {
	return s.authRepo.GetUserByUsername(username)
}

func (s *authService) GetUserByID(id uint) (*model.User, error) {
	return s.authRepo.GetUserByID(id)
}

func (s *authService) CheckUsername(username string) bool {
	return s.authRepo.CheckUsername(username)
}

func (s *authService) Register(user *model.User) error {
	if err := s.authRepo.Register(user); err != nil {
		return err
	}

	return nil
}

func (s *authService) Login(username string) (string, error) {
	password, err := s.authRepo.Login(username)
	if err != nil {
		return "", err
	}

	return password, nil
}

func (s *authService) CheckID(id int) bool {
	return s.authRepo.CheckID(id)
}

func (s *authService) Delete(id int) error {
	if err := s.authRepo.Delete(id); err != nil {
		return err
	}

	return nil
}

func (s *authService) GetUserByEmail(email string) (*model.User, error) {
	return s.authRepo.GetUserByEmail(email)
}

func (s *authService) SaveRecoveryTokenToDB(user *model.User, token string) error {
	return s.authRepo.SaveRecoverToken(user, token)
}
