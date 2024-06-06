package controller

import (
	"server/internal/models"
	"server/internal/repository"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	repository *repository.Repositorys
}

func NewAuthController(repository *repository.Repositorys) *AuthController {
	return &AuthController{
		repository: repository,
	}
}

var SecretKey = []byte("secret")

func GenerateJWTToken(user *models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.UserID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		return "", nil
	}

	return tokenString, nil
}

func (ac *AuthController) HashPassword(password []byte) ([]byte, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return hashedPassword, nil
}

func CheckHashPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
