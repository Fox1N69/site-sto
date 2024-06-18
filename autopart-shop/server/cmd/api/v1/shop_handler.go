package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/infra"
	"shop-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ShopHandler interface {
	GetAllAutoPart(c *gin.Context)
	GetAllModelAuto(c *gin.Context)
	SearchAutoPart(c *gin.Context)
	GetModelAutoByBrandID(c *gin.Context)
}

type shopHandler struct {
	basketService   service.BasketService
	autopartService service.AutoPartService
	autoService     service.AutoService
	infra           infra.Infra
}

func NewShopHandler(autoService service.AutoService, basketService service.BasketService, autopartService service.AutoPartService, infra infra.Infra) ShopHandler {
	return &shopHandler{
		basketService:   basketService,
		autopartService: autopartService,
		autoService:     autoService,
		infra:           infra,
	}
}

func (h *shopHandler) GetAllAutoPart(c *gin.Context) {
	autoparts, err := h.autopartService.GetAllAutoParts()
	if err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	// Загрузка связанных категорий и брендов
	for i := range autoparts {
		h.infra.GormDB().Preload("Category").Preload("Brand").Find(&autoparts[i])
	}

	c.JSON(http.StatusOK, autoparts)
}

func (h *shopHandler) SearchAutoPart(c *gin.Context) {
	rawQuery := c.Query("query")

	data, err := h.autopartService.Search(rawQuery)
	if err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, data)
}

func (h *shopHandler) GetAllModelAuto(c *gin.Context) {
	data, err := h.autoService.GetAllModelAuto()
	if err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, data)
}

func (h *shopHandler) GetModelAutoByBrandID(c *gin.Context) {
	brandID, err := strconv.Atoi(c.Param("brand_id"))
	if err != nil {
		response.New(c).Error(http.StatusBadRequest, err)
		return
	}

	data, err := h.autoService.GetModelAutoByBrandID(uint(brandID))
	if err != nil {
		response.New(c).Error(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, data)
}
