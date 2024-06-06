package controller

import (
	"server/internal/models"
	"server/internal/repository"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	repository *repository.Repositorys
}

type AuthControllerI interface {
	Register(c *fiber.Ctx) error
	Login(c *fiber.Ctx) error
	Logou(c *fiber.Ctx) error
	RefreshToken(c *fiber.Ctx) error
	Restricted(c *fiber.Ctx) error
}

func NewAuthController(repository *repository.Repositorys) *AuthController {
	return &AuthController{
		repository: repository,
	}
}

var SecretKey = []byte("secret")

func generateJWTToken(user *models.User) (string, error) {
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

func hashPassword(password []byte) ([]byte, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return hashedPassword, nil
}
