package server

import (
	"server/internal/repository"
	"server/internal/service"

	"github.com/gofiber/fiber/v2"
)

type FiberServer struct {
	*fiber.App

	repository *repository.Repositorys
	service    *service.Services
}

func New(service *service.Services, repo *repository.Repositorys) *FiberServer {
	server := &FiberServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "RemZona-Shop",
			AppName:      "RemZona-Shop",
		}),
		service: service,
		repository: repo,
	}

	return server
}
