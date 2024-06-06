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
	repo := repository.NewRepositorys(db)
	hand := handler.NewHandlers(repo)
	authController := controller.NewAuthController(repo)
	services := service.NewServices(repo, authController)

	server := server.New(hand, repo, services)
	server.RegisterFiberRoutes()

	port, _ := strconv.Atoi(os.Getenv("PORT"))
	server.Listen(fmt.Sprintf(":%d", port))
}
