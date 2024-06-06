package server

import (
	"server/internal/handler"
	"server/internal/repository"
	"server/internal/service"

	"github.com/gofiber/fiber/v2"
)

type FiberServer struct {
	*fiber.App

	repository *repository.Repositorys
	handler    *handler.Handler
	service    *service.Services
}

func New(hand *handler.Handler, repo *repository.Repositorys, service *service.Services) *FiberServer {
	server := &FiberServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "RemZona-Shop",
			AppName:      "RemZona-Shop",
		}),
		handler:    hand,
		repository: repo,
		service:    service,
	}

	return server
}
