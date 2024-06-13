package model

import (
	"database/sql"
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
	Name         string         `json:"name"`
	Price        int            `json:"price"`
	Img          string         `json:"img"`
	ModelName    string         `json:"model_name"`
	CategoryID   uint           `json:"category_id"`
	Category     Category       `gorm:"foreignKey:CategoryID"`
	BrandID      uint           `json:"brand_id"`
	Brand        Brand          `gorm:"foreignKey:BrandID"`
	AutoPartInfo []AutoPartInfo `json:"auto_part_info" gorm:"foreignKey:AutoPartID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Stock        uint           `json:"stock"`
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
	AutoParts []AutoPart `gorm:"foreignKey:CategoryID"`
	Brands    []Brand    `gorm:"many2many:brand_categories;"`
}

type Brand struct {
	ShopCustom
	Name       string     `json:"name"`
	AutoParts  []AutoPart `gorm:"foreignKey:BrandID"`
	Categories []Category `gorm:"many2many:brand_categories;"`
}

type BrandCategory struct {
	BrandID    uint
	CategoryID uint
}

type Order struct {
	GormCustom
	Status string `json:"status"`
	Total  int    `json:"total"`
	UserID uint   `json:"user_id" gorm:"foreignKey:ID"`
}