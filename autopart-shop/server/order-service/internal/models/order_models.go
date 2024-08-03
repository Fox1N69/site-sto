package models

import (
	"database/sql"
)

type ShopCustom struct {
	ID        uint         `json:"id" gorm:"primaryKey"`
	DeletedAt sql.NullTime `json:"deleted_at" gorm:"index"`
}

type Order struct {
	ShopCustom
	Status          string   `json:"status"`
	Email           string   `json:"email"`
	PhoneNumber     string   `json:"phone_number"`
	DeliveryCity    string   `json:"delivery_city"`
	DeliveryAddress string   `json:"delivery_address"`
	DeliveryCost    float64  `json:"delivery_cost"`
	PaymentMethod   string   `json:"payment_method"`
	Comment         string   `json:"comment"`
	TrackingNumber  string   `json:"tracking_number"`
	VinOrder        VinOrder `gorm:"foreignKey:OrderID"`
}

type VinOrder struct {
	ID        uint   `json:"id"`
	VinNumber string `json:"vin_number"`
	PartName  string `json:"part_name"`
	Auto      string `json:"auto"`
	ModelAuto string `json:"model_auto"`
	OrderID   uint   `json:"order_id"`
}
