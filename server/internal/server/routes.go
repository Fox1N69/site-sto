package server

import (
	"server/internal/models"

	"github.com/gofiber/fiber/v2"
)

func (s *FiberServer) RegisterFiberRoutes() {
	s.App.Get("/", s.HelloWorldHandler)
	s.App.Post("/order", s.CreateOrder)
}

func (s *FiberServer) HelloWorldHandler(c *fiber.Ctx) error {
	resp := fiber.Map{
		"message": "Hello World",
	}

	return c.JSON(resp)
}

func (s *FiberServer) CreateOrder(c *fiber.Ctx) error {
	order := new(models.Order)

	if err := c.BodyParser(order); err != nil {
		return err
	}

	if err := s.repository.Order.CreateOrder(order); err != nil {
		return err
	}

	return c.JSON(order)
}

func (s *FiberServer) GetAllData(c *fiber.Ctx) error {
	return nil
}
