package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"shop-server-order/common/http/response"
	"shop-server-order/common/util/token"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

type Middleware interface {
	CORS() fiber.Handler
	AUTH() fiber.Handler
	Role(requiredRole string) fiber.Handler
}

type middleware struct {
	secretKey string
}

func NewMiddleware(secretKey string) Middleware {
	return &middleware{secretKey: secretKey}
}

func (m *middleware) CORS() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		return c.Next()
	}
}

func (m *middleware) AUTH() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		authBearer := strings.Split(authHeader, " ")

		if len(authBearer) != 2 {
			response.New(c).Error(http.StatusUnauthorized, errors.New("invalid authorization token"))
			return c.SendStatus(http.StatusUnauthorized)
		}

		tokenString := authBearer[1]
		token, err := token.NewToken(m.secretKey).ValidateToken(tokenString)
		if err != nil || !token.Valid {
			response.New(c).Error(http.StatusUnauthorized, fmt.Errorf("invalid authorization token: %v", err))
			return c.SendStatus(http.StatusUnauthorized)
		}

		return c.Next()
	}
}

func (m *middleware) Role(requiredRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		authBearer := strings.Split(authHeader, " ")

		if len(authBearer) != 2 {
			response.New(c).Error(http.StatusUnauthorized, errors.New("invalid authorization token"))
			return c.SendStatus(http.StatusUnauthorized)
		}

		tokenString := authBearer[1]
		token, err := token.NewToken(m.secretKey).ValidateToken(tokenString)
		if err != nil || !token.Valid {
			response.New(c).Error(http.StatusUnauthorized, fmt.Errorf("invalid authorization token: %v", err))
			return c.SendStatus(http.StatusUnauthorized)
		}

		// Получение роли пользователя из токена
		userRole, ok := token.Claims.(jwt.MapClaims)["role"].(string)
		if !ok {
			response.New(c).Error(http.StatusUnauthorized, errors.New("unable to extract user role from token"))
			return c.SendStatus(http.StatusUnauthorized)
		}

		// Проверка наличия требуемой роли у пользователя
		if userRole != requiredRole {
			response.New(c).Error(http.StatusForbidden, errors.New("access denied: insufficient role"))
			return c.SendStatus(http.StatusForbidden)
		}

		return c.Next()
	}
}
