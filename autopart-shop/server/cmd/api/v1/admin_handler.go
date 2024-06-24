package v1

import (
	"encoding/json"
	"net/http"
	"shop-server/common/http/response"
	"shop-server/infra"
	"shop-server/internal/model"
	"shop-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type AdminHandler interface {
	Test(c *gin.Context)
	CreateAutoPart(c *gin.Context)
	DeleteAutoPart(c *gin.Context)
	UpdateAutoPart(c *gin.Context)
	CreateModelAuto(c *gin.Context)
	DeleteModelAuto(c *gin.Context)
	GetAllModelAutoWS(c *gin.Context)
	UpdateModelAuto(c *gin.Context)
}

type adminHandler struct {
	service     service.AutoPartService
	autoService service.AutoService
	infra       infra.Infra
	secretKey   string
}

func NewAdminHandler(infra infra.Infra, autopartService service.AutoPartService, autoService service.AutoService, secretKey string) AdminHandler {
	return &adminHandler{
		infra:       infra,
		service:     autopartService,
		autoService: autoService,
		secretKey:   secretKey,
	}
}

func (h *adminHandler) Test(c *gin.Context) {
	response.New(c).Write(http.StatusOK, "success")
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type CreateAutoPartRequest struct {
	Name         string               `json:"name" binding:"required"`
	ModelName    string               `json:"model_name"`
	Price        int                  `json:"price" binding:"required"`
	Img          string               `json:"img"`
	CategoryIDs  []uint               `json:"category_id" binding:"required"`
	ModelAutoIDs []uint               `json:"model_auto_id" binding:"required"`
	BrandID      uint                 `json:"brand_id" binding:"required"`
	AutoPartInfo []model.AutoPartInfo `json:"auto_part_info"`
	Stock        uint                 `json:"stock" binding:"required"`
	ForYears     json.RawMessage      `json:"for_years" binding:"required"`
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
		Image:     req.Img,
		BrandID:   req.BrandID,
		Stock:     req.Stock,
		ForYears:  req.ForYears,
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

	for _, modelAutoID := range req.ModelAutoIDs {
		autoPart.ModelAutos = append(autoPart.ModelAutos, model.ModelAuto{ShopCustom: model.ShopCustom{ID: modelAutoID}})
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

func (h *adminHandler) CreateModelAuto(c *gin.Context) {
	data := new(model.ModelAuto)
	c.ShouldBind(data)

	if err := h.autoService.CreateModelAuto(data); err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Model create success"})
}

func (h *adminHandler) DeleteModelAuto(c *gin.Context) {
	modelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.New(c).Write(http.StatusBadRequest, err.Error())
		return
	}

	if err := h.autoService.DeleteModelAuto(uint(modelID)); err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(200, gin.H{"message": "ModelAuto delete success"})
}

func (h *adminHandler) GetAllModelAutoWS(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logrus.Println("Failed to set websocket upgrade:", err)
		http.Error(c.Writer, "Failed to set websocket upgrade", http.StatusInternalServerError)
		return
	}
	defer conn.Close()
	logrus.Println("WebSocket connection established")

	eventCh := make(chan model.ModelAuto)
	doneCh := make(chan struct{})

	go func() {
		defer close(eventCh)
		for {
			select {
			case newAuto := <-h.autoService.AddModelAutoToChannel():
				logrus.Println("Received new model auto:", newAuto)
				eventCh <- newAuto
			case <-doneCh:
				logrus.Println("Done channel closed")
				return
			}
		}
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logrus.Println("WebSocket unexpected close error:", err)
				c.Writer.WriteHeader(http.StatusInternalServerError)
				return
			}
			logrus.Println("WebSocket read error:", err)
			break
		}

		logrus.Println("WebSocket message received:", string(message))

		switch string(message) {
		case "getAllModel":
			data, err := h.autoService.GetAllModelAuto()
			if err != nil {
				logrus.Println("Error getting all model auto:", err)
				response.New(c).Write(http.StatusInternalServerError, err.Error())
				return
			}
			conn.WriteJSON(data)
		case "subscribeEvents":
			go func(ch chan model.ModelAuto, conn *websocket.Conn, doneCh chan struct{}) {
				for event := range ch {
					if err := conn.WriteJSON(event); err != nil {
						logrus.Println("WebSocket write error:", err)
						return
					}
				}
				close(doneCh)
			}(eventCh, conn, doneCh)
		default:
			conn.WriteMessage(websocket.TextMessage, []byte("Unknown command"))
		}
	}

	close(doneCh)
	logrus.Println("WebSocket connection closed")
}
func (h *adminHandler) UpdateModelAuto(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.New(c).Write(http.StatusBadRequest, err.Error())
		return
	}

	var request struct {
		Name        string          `json:"name"`
		ImgUrl      string          `json:"img_url"`
		BrandID     uint            `json:"brand_id"`
		ReleaseYear json.RawMessage `json:"release_year"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		response.New(c).Write(http.StatusBadRequest, err.Error())
		return
	}

	if err := h.autoService.UpdateModelAuto(uint(id), request.Name, request.ImgUrl, request.BrandID, request.ReleaseYear); err != nil {
		response.New(c).Write(http.StatusInternalServerError, err.Error())
		return
	}

	response.New(c).Write(http.StatusOK, "ModelAuto updated successfully")
}
