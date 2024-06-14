package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/infra"
	"shop-server/internal/service"

	"github.com/gin-gonic/gin"
)

type ShopHandler interface {
	GetAllAutoPart(c *gin.Context)
	SearchAutoPart(c *gin.Context)
}

type shopHandler struct {
	basketService   service.BasketService
	autopartService service.AutoPartService
	infra           infra.Infra
}

func NewShopHandler(basketService service.BasketService, autopartService service.AutoPartService, infra infra.Infra) ShopHandler {
	return &shopHandler{
		basketService:   basketService,
		autopartService: autopartService,
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
	query := c.Query("query")

	data, err := h.autopartService.Search(query)
	if err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, data)
}
