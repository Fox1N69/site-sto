package service

import (
	"server/internal/models"
	"server/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type Services struct {
	repo *repository.Repositorys
}

func NewServices(repo *repository.Repositorys) *Services {
	return &Services{
		repo: repo,
	}
}

func (s *Services) GetAllData(c *fiber.Ctx) error {
	var data []models.Shop

	err := s.repo.GetAllData(&data)
	if err != nil {
		return err
	}

	return c.JSON(data)
}
