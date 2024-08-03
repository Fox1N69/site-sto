package request

import (
	"errors"
	"net/http"

	"shop-server-order/common/http/response"

	"github.com/gofiber/fiber/v2"
)

type Handler interface {
	NoRoute(c *fiber.Ctx) error
	Index(c *fiber.Ctx) error
}

type handler struct {
	// Stuff maybe needed for handler
}

func DefaultHandler() Handler {
	return &handler{}
}

func (h *handler) NoRoute(c *fiber.Ctx) error {
	response.New(c).Error(http.StatusNotFound, errors.New("route not found"))
	return nil
}

func (h *handler) Index(c *fiber.Ctx) error {
	response.New(c).Write(http.StatusOK, "application running")
	return nil
}
