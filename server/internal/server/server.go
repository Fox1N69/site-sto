package server

import (
	"server/internal/handler"
	"server/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type FiberServer struct {
	*fiber.App

	repository *repository.Repositorys
	handler    *handler.Handler
}

func New(hand *handler.Handler, repo *repository.Repositorys) *FiberServer {
	server := &FiberServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "RemZona-Shop",
			AppName:      "RemZona-Shop",
		}),
		handler:    hand,
		repository: repo,
	}

	return server
}
