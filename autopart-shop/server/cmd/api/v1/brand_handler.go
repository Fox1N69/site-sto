package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/internal/model"
	"shop-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BrandHandler interface {
	CreateBrand(c *gin.Context)
	GetAllBrands(c *gin.Context)
	UpdateBrand(c *gin.Context)
}

type brandHandler struct {
	service service.BrandService
}

func NewBrandHandler(brandService service.BrandService) BrandHandler {
	return &brandHandler{service: brandService}
}

func (h *brandHandler) CreateBrand(c *gin.Context) {
	data := new(model.Brand)
	c.BindJSON(data)

	if err := h.service.CreateBrand(data); err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "brand create success")
}

func (h *brandHandler) GetAllBrands(c *gin.Context) {
	data, err := h.service.GetAllBrand()
	if err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, data)
}

func (h *brandHandler) UpdateBrand(c *gin.Context) {
	brandID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(500, gin.H{"message": "falat part id"})
		return
	}

	brand, err := h.service.GetBrandByID(uint(brandID))
	if err != nil {
		response.New(c).Error(500, err)
		return
	}

	if err := c.ShouldBind(&brand); err != nil {
		response.New(c).Error(400, err)
		return
	}

	if err := h.service.UpdateBrand(brand); err != nil {
		response.New(c).Error(500, err)
		return
	}

	c.JSON(200, brand)
}
