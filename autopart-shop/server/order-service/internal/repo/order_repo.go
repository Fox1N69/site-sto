package repo

import (
	"fmt"
	"shop-server-order/internal/models"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type OrderRepo interface {
	CreateOrderWithVinOrder(order models.Order, vinOrders []models.VinOrder) (*models.Order, error)
	CreateOrder(order models.Order) (uint, error)
	CreateVinOrder(vinOrder models.VinOrder) (*models.VinOrder, error)
	Orders() ([]models.VinOrder, error)
	Delete(id uint) error
	GetAllBotChatIDs() ([]int64, error)
	GetOrderWithVinOrders(orderID uint) (*models.Order, error) // Новый метод
	LastOrder() (*models.Order, error)
}

type orderRepo struct {
	db *gorm.DB
}

func NewOrderRepo(db *gorm.DB) OrderRepo {
	return &orderRepo{db: db}
}

// Создание заказа с множественными VinOrder
func (s *orderRepo) CreateOrderWithVinOrder(order models.Order, vinOrders []models.VinOrder) (*models.Order, error) {
	// Начинаем транзакцию
	tx := s.db.Begin()

	// Сохраняем Order
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Отладочное сообщение
	logrus.Infof("Order created with ID: %d", order.ID)

	// Проверка, есть ли записи в vinOrders для вставки
	if len(vinOrders) > 0 {
		// Устанавливаем ID созданного Order в VinOrders
		for i := range vinOrders {
			vinOrders[i].OrderID = order.ID
		}

		// Отладочное сообщение
		logrus.Infof("Inserting %d VinOrders", len(vinOrders))

		// Сохраняем VinOrders
		if err := tx.Create(&vinOrders).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
	} else {
		// Отладочное сообщение
		logrus.Info("No VinOrders to insert")
	}

	// Завершаем транзакцию
	tx.Commit()

	return &order, nil
}

// Создание заказа
func (r *orderRepo) CreateOrder(order models.Order) (uint, error) {
	if err := r.db.Create(&order).Error; err != nil {
		logrus.Errorf("Failed to create order: %v", err)
		return 0, fmt.Errorf("failed to create order: %v", err)
	}

	return order.ID, nil
}

// Создание запчасти
func (r *orderRepo) CreateVinOrder(vinOrder models.VinOrder) (*models.VinOrder, error) {
	if err := r.db.Create(&vinOrder).Error; err != nil {
		logrus.Errorf("Failed to create vin order: %v", err)
		return &models.VinOrder{}, fmt.Errorf("failed to create vin order: %v", err)
	}

	return &vinOrder, nil
}

// Получение всех VinOrders (может быть изменен в зависимости от потребностей)
func (r *orderRepo) Orders() ([]models.VinOrder, error) {
	var orders []models.VinOrder
	if err := r.db.Find(&orders).Error; err != nil {
		logrus.Error("Failed to get vin orders")
		return nil, fmt.Errorf("failed to get vin orders: %v", err)
	}

	return orders, nil
}

// Удаление заказа
func (r *orderRepo) Delete(id uint) error {
	var order models.VinOrder
	return r.db.Where("id = ?", id).Delete(&order).Error
}

// Получение всех ChatID ботов
func (r *orderRepo) GetAllBotChatIDs() ([]int64, error) {
	var chatIDs []int64
	// Выполняем запрос для получения всех ChatID
	if err := r.db.Model(&models.NotificationUser{}).Pluck("chat_id", &chatIDs).Error; err != nil {
		return nil, err
	}

	return chatIDs, nil
}

// Получение заказа с связанными VinOrders по OrderID
func (r *orderRepo) GetOrderWithVinOrders(orderID uint) (*models.Order, error) {
	var order models.Order

	// Используем Preload для загрузки связанных VinOrders
	if err := r.db.Preload("VinOrder").First(&order, orderID).Error; err != nil {
		logrus.Errorf("Failed to get order with vin orders: %v", err)
		return nil, fmt.Errorf("failed to get order with vin orders: %v", err)
	}

	return &order, nil
}

func (r *orderRepo) LastOrder() (*models.Order, error) {
	var order models.Order
	if err := r.db.Order("create_at desc").Find(&order).Error; err != nil {
		logrus.Errorf("Failed getter last order: %v", err)
		return nil, fmt.Errorf("failed getter last order: %v", err)
	}

	return &order, nil
}
