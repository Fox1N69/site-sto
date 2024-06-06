package handler

import (
	"server/internal/models"
	"server/internal/service"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.Services) *UserHandler {
	return &UserHandler{service: service.User}
}

func (h *UserHandler) Register(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return err
	}

	data, err := h.service.Registration(user)
	if err != nil {
		return err
	}

	return c.JSON(data)
}
