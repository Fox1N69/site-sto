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
	repo := repository.NewRepositorys(db)
	hand := handler.NewHandlers(repo)
	server := server.New(hand, repo)

	server.RegisterFiberRoutes()
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	err := server.Listen(fmt.Sprintf(":%d", port))
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
