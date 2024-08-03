package service

import (
	"shop-server-order/internal/models"
	"shop-server-order/internal/repo"
)

type OrderService interface {
	CreateOrderWithVinOrder(order models.Order, vinOrder models.VinOrder) (*models.Order, error)
	CreateOrder(order models.Order) (uint, error)
	CreateVinOrder(vinOrder models.VinOrder) (*models.VinOrder, error)
	GetAllOrders() ([]models.VinOrder, error)
	DeleteOrder(id uint) error
	GetAllBotChatIDs() ([]int64, error)
}

type orderService struct {
	repository repo.OrderRepo
}

func NewOrderService(orderRepository repo.OrderRepo) OrderService {
	return &orderService{
		repository: orderRepository,
	}
}

func (s *orderService) CreateOrderWithVinOrder(order models.Order, vinOrder models.VinOrder) (*models.Order, error) {
	return s.repository.CreateOrderWithVinOrder(order, vinOrder)
}

func (s *orderService) CreateOrder(order models.Order) (uint, error) {
	return s.repository.CreateOrder(order)
}

func (s *orderService) CreateVinOrder(vinOrder models.VinOrder) (*models.VinOrder, error) {
	order, err := s.repository.CreateVinOrder(vinOrder)
	if err != nil {
		return &models.VinOrder{}, err
	}

	return order, nil
}

func (s *orderService) GetAllOrders() ([]models.VinOrder, error) {
	return s.repository.Orders()
}

func (s *orderService) DeleteOrder(id uint) error {
	return s.repository.Delete(id)
}

func (s *orderService) GetAllBotChatIDs() ([]int64, error) {
	return s.repository.GetAllBotChatIDs()
}
