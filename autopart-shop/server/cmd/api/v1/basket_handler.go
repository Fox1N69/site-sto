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
	UpdateBasketItemQuantity(c *gin.Context)
	RemoveItemByID(c *gin.Context)
	RemoveAllItems(c *gin.Context)
	CheckBasket(c *gin.Context)
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

	userID, err := strconv.Atoi(c.Param("id"))
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

func (h *basketHandler) RemoveItemByID(c *gin.Context) {
	itemID, _ := strconv.ParseUint(c.Param("id"), 10, 30)

	if err := h.service.RemoveItem(uint(itemID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "item removed from basket"})
}

func (h *basketHandler) RemoveAllItems(c *gin.Context) {
	userID, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	basket, err := h.service.GetBasketByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.RemoveAllItems(basket.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "all items removed from basket", "basket": basket})
}

func (h *basketHandler) UpdateBasketItemQuantity(c *gin.Context) {
	userID, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	autoPartID, _ := strconv.ParseUint(c.Param("autopart_id"), 10, 32)

	type UpdateQuantityRequest struct {
		Quantity uint `json:"quantity"`
	}

	var req UpdateQuantityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateBasketItemQuantity(uint(userID), uint(autoPartID), req.Quantity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "quantity updated"})
}

func (h *basketHandler) CheckBasket(c *gin.Context) {
	autoPartID, _ := strconv.ParseUint(c.Param("autopart_id"), 10, 32)
	userID, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	basket, err := h.service.GetBasketByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	exist, err := h.service.CheckBasket(basket.ID, uint(autoPartID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exist": exist})
}
