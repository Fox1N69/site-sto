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
	Image        string         `json:"img_url"`
	ModelName    string         `json:"model_name"`
	Categories   []Category     `json:"categories" gorm:"many2many:auto_part_categories;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	BrandID      uint           `json:"brand_id"`
	Brand        Brand          `gorm:"foreignKey:BrandID"`
	AutoPartInfo []AutoPartInfo `json:"auto_part_info" gorm:"foreignKey:AutoPartID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Stock        uint           `json:"stock"`
	ModelAutoID  uint           `json:"mode_auto_id"`
	ModelAuto    ModelAuto      `gorm:"foreignKey:ModelAutoID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type ModelAuto struct {
	ShopCustom
	Name        string     `json:"name"`
	Image       string     `json:"img_url"`
	AutoPart    []AutoPart `json:"auto_part" gorm:"foreginKey:ModelAutoID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	BrandID     uint       `json:"brand_id"`
	Brand       Brand      `gorm:"primaryKey:BrandID"`
	ReleaseYear int        `json:"release_year"`
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
	BrandID    uint
	CategoryID uint
}

type Order struct {
	GormCustom
	Status string `json:"status"`
	Total  int    `json:"total"`
	UserID uint   `json:"user_id" gorm:"foreignKey:ID"`
}
