package model

import (
	"database/sql"
	"encoding/json"
)

type ShopCustom struct {
	ID        uint         `json:"id" gorm:"primaryKey"`
	DeletedAt sql.NullTime `json:"deleted_at" gorm:"index"`
}

type Basket struct {
	ShopCustom
	UserID      uint         `json:"user_id" gorm:"unique"`
	BasketItems []BasketItem `gorm:"foreignKey:BasketID"`
}

type BasketItem struct {
	ShopCustom
	BasketID   uint     `json:"basket_id"`
	Basket     Basket   `gorm:"foreignKey:BasketID"`
	AutoPartID uint     `json:"autopart_id"`
	AutoPart   AutoPart `gorm:"foreignKey:AutoPartID"`
	Quantity   uint     `json:"quantity"`
}

type AutoPart struct {
	ShopCustom
	Name         string          `json:"name"`
	Price        int             `json:"price"`
	Image        string          `json:"img_url"`
	ModelName    string          `json:"model_name"`
	Categories   []Category      `json:"categories" gorm:"many2many:auto_part_categories;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	BrandID      uint            `json:"brand_id"`
	Brand        Brand           `gorm:"foreignKey:BrandID"`
	AutoPartInfo []AutoPartInfo  `json:"auto_part_info" gorm:"foreignKey:AutoPartID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Stock        uint            `json:"stock"`
	ModelAutos   []ModelAuto     `gorm:"many2many:model_auto_auto_parts;" json:"model_autos"`
	ForYears     json.RawMessage `json:"for_years" gorm:"type:jsonb"`
	Deleted      bool            `json:"deleted,omitempty"`
}

type ModelAuto struct {
	ShopCustom
	Name        string          `json:"name"`
	Image       string          `json:"img_url"`
	AutoPart    []AutoPart      `json:"auto_part" gorm:"many2many:model_auto_auto_parts;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	BrandID     uint            `json:"brand_id"`
	Brand       Brand           `gorm:"foreignKey:BrandID"`
	ReleaseYear json.RawMessage `json:"release_year" gorm:"type:jsonb"`
	Deleted     bool            `json:"deleted,omitempty"`
}

type ModelAutoAutoPart struct {
	ModelAutoID uint `gorm:"primaryKey"`
	AutoPartID  uint `gorm:"primaryKey"`

	ModelAuto ModelAuto `gorm:"foreignKey:ModelAutoID"`
	AutoPart  AutoPart  `gorm:"foreignKey:AutoPartID"`
}

type AutoPartInfo struct {
	ShopCustom
	AutoPartID  uint     `json:"autopart_id"`
	AutoPart    AutoPart `gorm:"foreignKey:AutoPartID"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
}

type Category struct {
	ShopCustom
	Name      string     `json:"name"`
	ImageUrl  string     `json:"image_url"`
	AutoParts []AutoPart `json:"auto_parts" gorm:"many2many:auto_part_categories;"`
	Brands    []Brand    `gorm:"many2many:brand_categories;"`
}

type AutoPartCategory struct {
	AutoPartID uint `gorm:"primaryKey;constraint:OnDelete:CASCADE"`
	CategoryID uint `gorm:"primaryKey;constraint:OnDelete:CASCADE"`

	AutoPart AutoPart `gorm:"foreignKey:AutoPartID;constraint:OnDelete:CASCADE"`
	Category Category `gorm:"foreignKey:CategoryID;constraint:OnDelete:CASCADE"`
}
type Brand struct {
	ShopCustom
	Name       string     `json:"name"`
	ImageUrl   string     `json:"image_url"`
	AutoParts  []AutoPart `gorm:"foreignKey:BrandID"`
	Categories []Category `gorm:"many2many:brand_categories;"`
}

type BrandCategory struct {
	BrandID    uint `gorm:"primaryKey;constraint:OnDelete:CASCADE"`
	CategoryID uint `gorm:"primaryKey;constraint:OnDelete:CASCADE"`

	Brand    Brand    `gorm:"foreignKey:BrandID;constraint:OnDelete:CASCADE"`
	Category Category `gorm:"foreignKey:CategoryID;constraint:OnDelete:CASCADE"`
}

type Order struct {
	ShopCustom
	Status          string  `json:"status"`
	Total           int     `json:"total"`
	Email           string  `json:"email" gorm:"unique"`
	PhoneNumber     string  `json:"phone_number"`
	DeliveryCity    string  `json:"delivery_city"`
	DeliveryAddress string  `json:"delivery_address"`
	DeliveryCost    float64 `json:"delivery_cost"`
	IsPaid          bool    `json:"is_paid"`
	PaymentMethod   string  `json:"payment_method"`
	Comment         string  `json:"comment"`
	TrackingNumber  string  `json:"tracking_number"`
	UserID          uint    `json:"user_id"`
	User            User    `gorm:"foreginKey:UserID"`
}
