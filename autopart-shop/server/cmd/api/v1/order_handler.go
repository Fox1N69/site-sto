package v1

import (
	"net/http"
	"shop-server/internal/model"
	"shop-server/internal/service"

	"github.com/gin-gonic/gin"
)

type OrderHandler interface {
	CreateOrder(c *gin.Context)
	CreateVinOrder(c *gin.Context)
	GetAllOrders(c *gin.Context)
}

type orderHandler struct {
	orderService service.OrderService
}

func NewOrderHandler(orderService service.OrderService) OrderHandler {
	return &orderHandler{orderService: orderService}
}

func (h *orderHandler) CreateOrder(c *gin.Context) {
	var order model.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.orderService.CreateOrder(c.Request.Context(), &order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order created successfully"})
}

func (h *orderHandler) CreateVinOrder(c *gin.Context) {
	var vin model.VinOrder
	if err := c.ShouldBind(&vin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.orderService.CreateVinOrder(&vin); err != nil {
		c.JSON(501, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, "create vin order success")
}

func (h *orderHandler) GetAllOrders(c *gin.Context) {
	orders, err := h.orderService.GetAllOrders(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}
