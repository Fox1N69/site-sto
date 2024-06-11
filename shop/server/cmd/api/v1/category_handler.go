package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/internal/model"
	"shop-server/internal/service"

	"github.com/gin-gonic/gin"
)

type CategoryHandler interface {
	CreateCategory(c *gin.Context)
}

type categoryHandler struct {
	service service.CategoryService
}

func NewCategoryHandler(categoryService service.CategoryService) CategoryHandler {
	return &categoryHandler{service: categoryService}
}

func (h *categoryHandler) CreateCategory(c *gin.Context) {
	data := new(model.Category)
	if err := c.BindJSON(data); err != nil {
		response.New(c).Error(http.StatusBadRequest, err)
		return
	}

	if err := h.service.CreateCategory(data); err != nil {
		response.New(c).Error(http.StatusInternalServerError, err)
		return
	}

	response.New(c).Write(http.StatusOK, "success")
}
