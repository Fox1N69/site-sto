package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/infra"
	"shop-server/internal/model"
	"shop-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AdminHandler interface {
	Test(c *gin.Context)
	CreateAutoPart(c *gin.Context)
	DeleteAutoPart(c *gin.Context)
	UpdateAutoPart(c *gin.Context)
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

type CreateAutoPartRequest struct {
	Name         string               `json:"name" binding:"required"`
	ModelName    string               `json:"model_name"`
	Price        int                  `json:"price" binding:"required"`
	Img          string               `json:"img"`
	CategoryIDs  []uint               `json:"category_id" binding:"required"`
	BrandID      uint                 `json:"brand_id" binding:"required"`
	AutoPartInfo []model.AutoPartInfo `json:"auto_part_info"`
	Stock        uint                 `json:"stock" binding:"required"`
}

func (h *adminHandler) CreateAutoPart(c *gin.Context) {
	var req CreateAutoPartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	autoPart := model.AutoPart{
		Name:      req.Name,
		ModelName: req.ModelName,
		Price:     req.Price,
		Img:       req.Img,
		BrandID:   req.BrandID,
		Stock:     req.Stock,
	}

	for _, info := range req.AutoPartInfo {
		autoPart.AutoPartInfo = append(autoPart.AutoPartInfo, model.AutoPartInfo{
			Title:       info.Title,
			Description: info.Description,
		})
	}

	for _, categoryID := range req.CategoryIDs {
		autoPart.Categories = append(autoPart.Categories, model.Category{ShopCustom: model.ShopCustom{ID: categoryID}})
	}

	if err := h.service.CreateAutoPart(&autoPart); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, autoPart)
}

func (h *adminHandler) DeleteAutoPart(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid auto part ID"})
		return
	}

	err = h.service.DeleteAutoPart(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Auto part deleted successfully"})
}

func (h *adminHandler) UpdateAutoPart(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var fieldsToUpdate map[string]interface{}
	if err := c.ShouldBindJSON(&fieldsToUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	product := model.AutoPart{ShopCustom: model.ShopCustom{ID: uint(id)}}
	if err := h.service.UpdateAutoPart(product, fieldsToUpdate); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Auto part updated successfully"})
}
