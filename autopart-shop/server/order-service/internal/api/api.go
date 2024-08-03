package api

import (
	"shop-server-order/common/http/middleware"
	"shop-server-order/common/http/request"
	"shop-server-order/infra"
	v1 "shop-server-order/internal/api/v1"
	"shop-server-order/internal/manager"
	"shop-server-order/utils/logger"

	"github.com/go-redis/redis/v8"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v3"
)

type Server interface {
	Run()
}

type server struct {
	infra       infra.Infra
	app         *fiber.App
	service     manager.ServiceManager
	middleware  middleware.Middleware
	redisClient *redis.Client
	log         logger.Logger
}

func NewServer(infra infra.Infra, redisClient *redis.Client) Server {

	return &server{
		infra: infra,
		app: fiber.New(fiber.Config{
			JSONEncoder: json.Marshal,
			JSONDecoder: json.Unmarshal,
		}),
		service:     manager.NewServiceManager(infra),
		middleware:  middleware.NewMiddleware(infra.Config().GetString("secret.key")),
		redisClient: redisClient,
		log:         logger.GetLogger(),
	}
}

func (s *server) Run() {
	s.app.Use(s.middleware.CORS())
	s.handlers()
	s.v1()

	s.app.Listen(s.infra.Port())

}

func (s *server) handlers() {
	h := request.DefaultHandler()

	//s.app.NoRoute(h.NoRoute)
	s.app.Get("/", h.Index)
}

func (s *server) v1() {
	orderHandler := v1.NewOrderHandler(s.service.OrderService(), s.infra.TelegramClient())

	api := s.app.Group("/api")
	{
		api.Get("/order", orderHandler.GetAllOrders)
		api.Post("/order", orderHandler.CreateOrder)
		api.Post("/vin-order", orderHandler.CreateVinOrder)
	}

}
