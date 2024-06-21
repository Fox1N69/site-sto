package api

import (
	v1 "shop-server/cmd/api/v1"
	"shop-server/common/http/middleware"
	"shop-server/common/http/request"
	"shop-server/infra"
	"shop-server/internal/manager"

	"github.com/gin-gonic/contrib/sessions"
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
	store      sessions.Store
}

func NewServer(infra infra.Infra) Server {
	store := sessions.NewCookieStore([]byte(infra.Config().GetString("secret.key")))

	return &server{
		infra:      infra,
		gin:        gin.Default(),
		service:    manager.NewServiceManager(infra),
		middleware: middleware.NewMiddleware(infra.Config().GetString("secret.key")),
		store:      store,
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
	authHandler := v1.NewAuthHandler(c.service.AuthService(), c.infra, c.service.BasketService(), c.service.Blacklist())
	adminHandler := v1.NewAdminHandler(c.infra, c.service.AutoPartService(), c.service.AutoService(), c.infra.Config().GetString("secret.key"))
	categoryHandler := v1.NewCategoryHandler(c.service.CategoryService())
	brandHandler := v1.NewBrandHandler(c.service.BrandService())
	basketHnalder := v1.NewBasketHandler(c.service.BasketService())
	shopHandler := v1.NewShopHandler(c.service.AutoService(), c.service.BasketService(), c.service.AutoPartService(), c.infra)
	orderHandler := v1.NewOrderHandler(c.service.OrderService())

	c.gin.Use(sessions.Sessions("user", c.store))

	shop := c.gin.Group("/shop")
	{
		shop.GET("/autoparts", shopHandler.GetAllAutoPart)
		shop.GET("/autoparts/search", shopHandler.SearchAutoPart)
		shop.GET("/categorys", categoryHandler.GetAllCategory)
		shop.GET("/brands", brandHandler.GetAllBrands)
		shop.GET("/modelautos", shopHandler.GetAllModelAuto)
		shop.GET("/modelauto/:brand_id", shopHandler.GetModelAutoByBrandID)
		shop.GET("/model-auto/ws/all", adminHandler.GetAllModelAutoWS)
		shop.GET("/auto-parts", shopHandler.GetAutoPartByBrandAndYear)
	}

	admin := c.gin.Group("/admin")
	{
		admin.Use(c.middleware.Role("admin"))
		admin.POST("/part/create", adminHandler.CreateAutoPart)
		admin.DELETE("/part/delete/:id", adminHandler.DeleteAutoPart)
		admin.PUT("/part/update/:id", adminHandler.UpdateAutoPart)

		brand := admin.Group("/brand")
		{
			brand.POST("/create", brandHandler.CreateBrand)
		}

		category := admin.Group("/category")
		{
			category.POST("/create", categoryHandler.CreateCategory)
		}

		modelauto := admin.Group("/model-auto")
		{
			modelauto.POST("/create", adminHandler.CreateModelAuto)
			modelauto.PUT("/update/:id", adminHandler.UpdateModelAuto)
			modelauto.DELETE("/delete/:id", adminHandler.DeleteModelAuto)
		}

		order := admin.Group("/order")
		{
			order.GET("/", orderHandler.GetAllOrders)
		}
	}

	v1 := c.gin.Group("v1/account")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
		}

		user := v1.Group("/user")
		user.Use(c.middleware.AUTH())
		{
			user.GET("/:id/basket", basketHnalder.GetBasket)
			user.PUT("/:id/update_basket/:autopart_id", basketHnalder.UpdateBasketItemQuantity)
			user.DELETE("/:id/remove_items/:autopart_id", basketHnalder.RemoveItemByID)
			user.DELETE("/:id/remove_all_items", basketHnalder.RemoveAllItems)
			user.POST("/:id/basket/items", basketHnalder.AddItemToBasket)
			user.DELETE("/delete", authHandler.Delete)
			user.GET("/:id", authHandler.GetUsernameByID)
			user.GET("/:id/check/:autopart_id", basketHnalder.CheckBasket)
			user.POST("/order/create", orderHandler.CreateOrder)
		}
	}
}
