package v1

import (
	"net/http"
	"shop-server/common/http/response"
	"shop-server/infra"

	"github.com/gin-gonic/gin"
)

type AdminHandler interface {
	Test(c *gin.Context)
}

type adminHandler struct {
	infra infra.Infra
}

func NewAdminHandler(infra infra.Infra) AdminHandler {
	return &adminHandler{
		infra: infra,
	}
}

func (h *adminHandler) Test(c *gin.Context) {
	response.New(c).Write(http.StatusOK, "success")
}
