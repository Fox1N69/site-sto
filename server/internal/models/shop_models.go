package models

import "time"

type Shop struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	Products  []Product  `json:"products" gorm:"foreignKey:ShopID"`
	Categorys []Category `json:"categorys" gorm:"foreignKey:ShopID"`
	Customers []Customer `json:"customers" gorm:"foreignKey:ShopID"`
}

// Товары
type Product struct {
	ProductID   uint   `json:"id" gorm:"primaryKey"`
	ShopID      uint   `json:"shop_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	CategoryID  uint   `json:"category_id"`
	Quantity    int    `json:"quantity"`
}

// Таблица категорий
type Category struct {
	CategoryID       uint   `json:"category_id" gorm:"primaryKey"`
	ShopID           uint   `json:"shop_id"`
	Name             string `json:"name"`
	Description      string `json:"description"`
	ParentCategoryID uint   `json:"parent_category_id"`
}

// Таблица клиента
type Customer struct {
	CustomerID uint   `json:"id" gorm:"primaryKey"`
	ShopID     uint   `json:"shop_id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Address    string `json:"address"`
	Password   []byte `json:"password"`
}

// Таблица заказа
type Order struct {
	OrderID     uint      `json:"order_id" gorm:"primaryKey"`
	ShopID      uint      `json:"shop_id"`
	CustomerID  uint      `json:"customer_id"`
	OrderDate   time.Time `json:"order_date"`
	Status      string    `json:"status"`
	TotalAmount float64   `json:"total_amount"`
}

// Таблица элементов заказа
type OrderItem struct {
	OrderItemID uint `json:"order_item_id"`
	OrderID     uint `json:"order_id"`
	ProductID   uint `json:"product_id"`
	Quantity    int  `json:"quantity"`
	UnitPrice   int  `json:"unit_price"`
}
