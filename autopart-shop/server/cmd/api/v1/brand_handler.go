package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/internal/model"
	"shop-server/internal/service"

	"github.com/gin-gonic/gin"
)

type BrandHandler interface {
	CreateBrand(c *gin.Context)
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
