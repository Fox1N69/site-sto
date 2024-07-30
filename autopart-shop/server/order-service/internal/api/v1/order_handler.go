package v1

import (
	"shop-server-order/common/http/response"
	"shop-server-order/internal/models"
	"shop-server-order/internal/service"

	"github.com/gin-gonic/gin"
)

type OrderHandler interface {
	CreateOrder(c *gin.Context)
	CreateVinOrder(c *gin.Context)
}

type orderHandler struct {
	service service.OrderService
}

func NewOrderHandler(orderService service.OrderService) OrderHandler {
	return &orderHandler{
		service: orderService,
	}
}

func (h *orderHandler) CreateOrder(c *gin.Context) {
	response := response.New(c)

	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		response.Error(404, err)
		return
	}

	id, err := h.service.CreateOrder(order)
	if err != nil {
		response.Error(501, err)
		return
	}

	c.JSON(201, gin.H{
		"message": "create message success",
		"id":      id,
	})
}

func (h *orderHandler) CreateVinOrder(c *gin.Context) {
	response := response.New(c)

	var order models.VinOrder
	if err := c.ShouldBindJSON(&order); err != nil {
		response.Error(404, err)
		return
	}

	id, err := h.service.CreateVinOrder(order)
	if err != nil {
		response.Error(501, err)
		return
	}

	c.JSON(201, gin.H{
		"message": "create message success",
		"id":      id,
	})
}
