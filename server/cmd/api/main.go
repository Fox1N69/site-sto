package main

import (
	"fmt"
	"os"
	"server/internal/controller"
	"server/internal/database"
	"server/internal/handler"
	"server/internal/repository"
	"server/internal/server"
	"server/internal/service"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	db := database.GetGormDB()
	repos := repository.NewRepositorys(db)
	authController := controller.NewAuthController(repos)
	services := service.NewServices(repos, authController)
	handlers := handler.NewHandlers(repos, authController)

	server := server.New(handlers, repos, services)
	server.RegisterFiberRoutes()

	port, _ := strconv.Atoi(os.Getenv("PORT"))
	server.Listen(fmt.Sprintf(":%d", port))
}
