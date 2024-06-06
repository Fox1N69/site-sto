package main

import (
	"fmt"
	"os"
	"server/internal/database"
	"server/internal/handler"
	"server/internal/repository"
	"server/internal/server"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	db := database.GetGormDB()
	repos := repository.NewRepositorys(db)
	handlers := handler.NewHandlers(repos)

	server := server.New(handlers, repos)
	server.RegisterFiberRoutes()

	port, _ := strconv.Atoi(os.Getenv("PORT"))
	server.Listen(fmt.Sprintf(":%d", port))
}
