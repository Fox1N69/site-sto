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
	ModelAutoWS(c *gin.Context)
	AutoPartWS(c *gin.Context)
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

func (h *adminHandler) ModelAutoWS(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logrus.Println("Не удалось установить веб-сокет соединение:", err)
		http.Error(c.Writer, "Не удалось установить веб-сокет соединение", http.StatusInternalServerError)
		return
	}
	defer conn.Close()
	logrus.Println("WebSocket соединение установлено")

	eventCh := make(chan model.ModelAuto)
	doneCh := make(chan struct{})

	// Горутина для прослушивания новых моделей
	go func() {
		defer close(eventCh)
		for {
			select {
			case newAuto := <-h.autoService.AddModelAutoToChannel():
				logrus.Println("Получена новая модель авто:", newAuto)
				eventCh <- newAuto
			case deletedModelID := <-h.autoService.DeleteModelFromChannel():
				logrus.Println("Удалена модель авто с ID:", deletedModelID)
				eventCh <- model.ModelAuto{
					ShopCustom: model.ShopCustom{ID: deletedModelID},
					Deleted:    true,
				}
			case <-doneCh:
				logrus.Println("Канал done закрыт")
				return
			}
		}
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logrus.Println("Неожиданная ошибка закрытия WebSocket:", err)
				c.Writer.WriteHeader(http.StatusInternalServerError)
				return
			}
			logrus.Println("Ошибка чтения WebSocket:", err)
			break
		}

		logrus.Println("Сообщение WebSocket получено:", string(message))

		var msg map[string]interface{}
		if err := json.Unmarshal(message, &msg); err != nil {
			conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат сообщения"))
			continue
		}

		switch msg["type"] {
		case "getAllModel":
			// Получение всех моделей
			data, err := h.autoService.GetAllModelAuto()
			if err != nil {
				logrus.Println("Ошибка получения всех моделей авто:", err)
				response.New(c).Write(http.StatusInternalServerError, err.Error())
				return
			}

			conn.WriteJSON(map[string]interface{}{
				"type":   "allModels",
				"models": data,
			})
		case "deleteModel":
			var modelIDStr string
			if val, ok := msg["modelID"].(string); ok {
				modelIDStr = val
			} else {
				conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат modelID"))
				continue
			}

			// Преобразование modelID из строки в тип uint
			modelID, err := strconv.ParseUint(modelIDStr, 10, 64)
			if err != nil {
				conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат modelID"))
				continue
			}

			// Удаление модели по modelID
			err = h.autoService.DeleteModelAuto(uint(modelID))
			if err != nil {
				logrus.Println("Ошибка удаления модели авто:", err)
				conn.WriteJSON(map[string]interface{}{
					"type":  "deleteModelError",
					"error": err.Error(),
				})
				continue
			}

			conn.WriteJSON(map[string]interface{}{
				"type":    "modelDeleted",
				"modelID": modelID,
			})
		case "subscribeEvents":
			go func(ch chan model.ModelAuto, conn *websocket.Conn, doneCh chan struct{}) {
				for {
					select {
					case event, ok := <-ch:
						if !ok {
							logrus.Println("Канал событий закрыт")
							return
						}
						if event.Deleted {
							// Отправка сообщения об удалении модели
							conn.WriteJSON(map[string]interface{}{
								"type":    "modelDeleted",
								"modelID": event.ID,
							})
						} else {
							// Отправка нового авто в формате newModelAdded
							conn.WriteJSON(map[string]interface{}{
								"type":  "newModelAdded",
								"model": event,
							})
						}
					case <-doneCh:
						logrus.Println("Получен сигнал done, остановка подписки")
						return
					}
				}
			}(eventCh, conn, doneCh)
		default:
			conn.WriteMessage(websocket.TextMessage, []byte("Неизвестная команда"))
		}
	}

	close(doneCh)
	logrus.Println("WebSocket соединение закрыто")
}

// WebSocket для таблицы с запчастями
func (h *adminHandler) AutoPartWS(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logrus.Println("Не удалось установить веб-сокет соединение:", err)
		http.Error(c.Writer, "Не удалось установить веб-сокет соединение", http.StatusInternalServerError)
		return
	}
	defer conn.Close()
	logrus.Println("WebSocket соединение установлено")

	eventCh := make(chan model.AutoPart)
	doneCh := make(chan struct{})

	go func() {
		defer close(eventCh)
		for {
			select {
			case newAutoPart := <-h.service.AddAutoPartToChannel():
				logrus.Println("Получена новая автозапчасть:", newAutoPart)
				eventCh <- newAutoPart
			case updatedAutoPart := <-h.service.UpdateToChannel():
				logrus.Println("Обновлена автозапчасть:", updatedAutoPart)
				eventCh <- updatedAutoPart
			case deletedAutoPartID := <-h.service.DeleteAtuoPartFromChannel():
				logrus.Println("Удалена автозапчасть с ID:", deletedAutoPartID)
				eventCh <- model.AutoPart{
					ShopCustom: model.ShopCustom{ID: deletedAutoPartID},
					Deleted:    true,
				}
			case <-doneCh:
				logrus.Println("Канал done закрыт")
				return
			}
		}
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logrus.Println("Неожиданная ошибка закрытия WebSocket:", err)
				c.Writer.WriteHeader(http.StatusInternalServerError)
				return
			}
			logrus.Println("Ошибка чтения WebSocket:", err)
			break
		}

		logrus.Println("Сообщение WebSocket получено:", string(message))

		var msg map[string]interface{}
		if err := json.Unmarshal(message, &msg); err != nil {
			conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат сообщения"))
			continue
		}

		switch msg["type"] {
		case "getAllAutoParts":
			data, source, err := h.service.GetAllAutoParts(c)
			if err != nil {
				logrus.Println("Ошибка получения всех автозапчастей:", err)
				conn.WriteJSON(map[string]interface{}{
					"type":  "getAllAutoPartsError",
					"error": err.Error(),
				})
				return
			}

			conn.WriteJSON(map[string]interface{}{
				"type":      "allAutoParts",
				"autoParts": data,
				"source":    source,
			})
		case "deleteAutoPart":
			var autoPartIDStr string
			if val, ok := msg["autoPartID"].(string); ok {
				autoPartIDStr = val
			} else {
				conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат autoPartID"))
				continue
			}

			autoPartID, err := strconv.ParseUint(autoPartIDStr, 10, 64)
			if err != nil {
				conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат autoPartID"))
				continue
			}

			err = h.service.DeleteAutoPart(uint(autoPartID))
			if err != nil {
				logrus.Println("Ошибка удаления автозапчасти:", err)
				conn.WriteJSON(map[string]interface{}{
					"type":  "deleteAutoPartError",
					"error": err.Error(),
				})
				continue
			}

			conn.WriteJSON(map[string]interface{}{
				"type":       "autoPartDeleted",
				"autoPartID": autoPartID,
			})
		case "updateAutoPart":
			var autoPartIDStr string
			var fieldsToUpdate map[string]interface{}
			if val, ok := msg["autoPartID"].(string); ok {
				autoPartIDStr = val
			} else {
				conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат autoPartID"))
				continue
			}

			if val, ok := msg["fieldsToUpdate"].(map[string]interface{}); ok {
				fieldsToUpdate = val
			} else {
				conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат fieldsToUpdate"))
				continue
			}

			autoPartID, err := strconv.ParseUint(autoPartIDStr, 10, 64)
			if err != nil {
				conn.WriteMessage(websocket.TextMessage, []byte("Неверный формат autoPartID"))
				continue
			}

			product := model.AutoPart{ShopCustom: model.ShopCustom{ID: uint(autoPartID)}}
			err = h.service.UpdateAutoPart(product, fieldsToUpdate)
			if err != nil {
				logrus.Println("Ошибка обновления автозапчасти:", err)
				conn.WriteJSON(map[string]interface{}{
					"type":  "updateAutoPartError",
					"error": err.Error(),
				})
				continue
			}

			conn.WriteJSON(map[string]interface{}{
				"type":       "autoPartUpdated",
				"autoPartID": autoPartID,
			})
		case "subscribeEvents":
			go func(ch chan model.AutoPart, conn *websocket.Conn, doneCh chan struct{}) {
				for {
					select {
					case event, ok := <-ch:
						if !ok {
							logrus.Println("Канал событий закрыт")
							return
						}
						if event.Deleted {
							conn.WriteJSON(map[string]interface{}{
								"type":       "autoPartDeleted",
								"autoPartID": event.ID,
							})
						} else if event.ID != 0 && event.Name != "" { // Проверка на наличие обновленных полей
							conn.WriteJSON(map[string]interface{}{
								"type":     "autoPartUpdated",
								"autoPart": event,
							})
						} else {
							conn.WriteJSON(map[string]interface{}{
								"type":     "newAutoPartAdded",
								"autoPart": event,
							})
						}
					case <-doneCh:
						logrus.Println("Получен сигнал done, остановка подписки")
						return
					}
				}
			}(eventCh, conn, doneCh)
		default:
			conn.WriteMessage(websocket.TextMessage, []byte("Неизвестная команда"))
		}
	}

	close(doneCh)
	logrus.Println("WebSocket соединение закрыто")
}

