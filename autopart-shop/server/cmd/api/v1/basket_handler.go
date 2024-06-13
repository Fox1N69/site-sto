package v1

import (
	"net/http"
	"shop-server/internal/model"
	"shop-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BasketHandler interface {
	GetBasket(c *gin.Context)
	AddItemToBasket(c *gin.Context)
}

type basketHandler struct {
	service service.BasketService
}

func NewBasketHandler(basketService service.BasketService) BasketHandler {
	return &basketHandler{
		service: basketService,
	}
}

func (h *basketHandler) GetBasket(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	basket, err := h.service.GetBasketByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, basket)
}

func (h *basketHandler) AddItemToBasket(c *gin.Context) {
	var item model.BasketItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	if err := h.service.AddItem(uint(userID), item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item added to basket"})
}
