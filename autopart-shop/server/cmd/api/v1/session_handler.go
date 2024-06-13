package v1

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type SessionHandler interface {
	SetSession(c *gin.Context)
}

type sessionHandler struct {
}

func NewSesstionHandler() SessionHandler {
	return &sessionHandler{}
}

func (h *sessionHandler) SetSession(c *gin.Context) {
	session := sessions.Default(c)
	userID := session.Get("userID")
	if userID != nil {
		c.String(http.StatusOK, "user id: %v", userID)
	} else {
		c.String(http.StatusOK, "no user id")
	}
}
