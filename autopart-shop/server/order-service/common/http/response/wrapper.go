package response

import (
	"net/http"
	"shop-server-order/internal/models"

	"github.com/gofiber/fiber/v2"
)

type Wrapper interface {
	Write(code int, message string)
	Error(code int, err error)
	Token(expired string, token string)
}

type wrapper struct {
	c *fiber.Ctx
}

func New(c *fiber.Ctx) Wrapper {
	return &wrapper{c: c}
}

func (w *wrapper) Write(code int, message string) {
	w.c.Status(code).JSON(models.Response{Code: code, Message: message})
}

func (w *wrapper) Error(code int, err error) {
	w.c.Status(code).JSON(models.Response{Code: code, Message: err.Error()})
}

func (w *wrapper) Token(expired string, token string) {
	w.c.Status(http.StatusOK).JSON(models.Token{Expired: expired, Token: token})
}
