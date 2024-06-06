package handler

import (
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
	
	return nil
}
