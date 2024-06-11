package v1

import (
	"log"
	"net/http"
	"shop-server/infra"
	"shop-server/internal/model"
	"shop-server/internal/service"

	"github.com/gin-gonic/gin"
)

type ShopHandler interface {
	CreateBasket(c *gin.Context)
}

type shopHandler struct {
	basketService service.BasketService
	infra         infra.Infra
}

func NewShopHandler(basketService service.BasketService, infra infra.Infra) ShopHandler {
	return &shopHandler{
		basketService: basketService,
		infra:         infra,
	}
}

func (sh *shopHandler) CreateBasket(c *gin.Context) {
	log.Println("CreateBasket handler called")

	basket := new(model.Basket)
	if err := c.BindJSON(basket); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := sh.basketService.Create(model.User{}); err != nil {
		log.Printf("Error creating basket: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("Basket created successfully")
	c.JSON(http.StatusOK, basket)
}
