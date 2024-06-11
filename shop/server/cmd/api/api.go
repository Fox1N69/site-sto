package api

import (
	v1 "shop-server/cmd/api/v1"
	"shop-server/common/http/middleware"
	"shop-server/common/http/request"
	"shop-server/infra"
	"shop-server/internal/manager"

	"github.com/gin-gonic/gin"
)

type Server interface {
	Run()
}

type server struct {
	infra      infra.Infra
	gin        *gin.Engine
	service    manager.ServiceManager
	middleware middleware.Middleware
}

func NewServer(infra infra.Infra) Server {
	return &server{
		infra:      infra,
		gin:        gin.Default(),
		service:    manager.NewServiceManager(infra),
		middleware: middleware.NewMiddleware(infra.Config().GetString("secret.key")),
	}
}

func (c *server) Run() {
	c.gin.Use(c.middleware.CORS())
	c.handlers()
	c.v1()

	c.gin.Run(c.infra.Port())
}

func (c *server) handlers() {
	h := request.DefaultHandler()

	c.gin.NoRoute(h.NoRoute)
	c.gin.GET("/", h.Index)
}

func (c *server) v1() {
	authHandler := v1.NewAuthHandler(c.service.AuthService(), c.infra, c.service.BasketService())
	adminHandler := v1.NewAdminHandler(c.infra)

	admin := c.gin.Group("/admin")
	{
		admin.Use(c.middleware.Role("admin"))
		admin.GET("/test", adminHandler.Test)
	}

	v1 := c.gin.Group("v1/account")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		user := v1.Group("/user")
		user.Use(c.middleware.AUTH())
		{
			user.DELETE("/delete", authHandler.Delete)
		}
	}
}
