package main

import (
	"fmt"
	"os"
	"server/internal/database"
	"server/internal/repository"
	"server/internal/server"
	"server/internal/service"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

func main() {

	db := database.GetGormDB()
	repo := repository.NewRepositorys(db)
	service := service.NewServices(repo)
	server := server.New(service, repo)

	server.RegisterFiberRoutes()
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	err := server.Listen(fmt.Sprintf(":%d", port))
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
