package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/infra"
	"shop-server/internal/model"
	"shop-server/internal/service"

	"github.com/gin-gonic/gin"
)

type AdminHandler interface {
	Test(c *gin.Context)
	CreateAutoPart(c *gin.Context)
}

type adminHandler struct {
	service service.AutoPartService
	infra   infra.Infra
}

func NewAdminHandler(infra infra.Infra, autopartService service.AutoPartService) AdminHandler {
	return &adminHandler{
		infra:   infra,
		service: autopartService,
	}
}

func (h *adminHandler) Test(c *gin.Context) {
	response.New(c).Write(http.StatusOK, "success")
}

func (h *adminHandler) CreateAutoPart(c *gin.Context) {
	var autoPart model.AutoPart
	if err := c.ShouldBindJSON(&autoPart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.Create(&autoPart); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, "autopart create success")
}

