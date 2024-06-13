package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type BasketRepo interface {
	Create(basket *model.Basket) error
	GetBasketByUserID(userID uint) (*model.Basket, error)
	AddItemToBasket(userID uint, item model.BasketItem) error
	UpdateBasketItem(itemID uint, newItem model.BasketItem) error
	RemoveItemFromBasket(itemID uint) error
	ClearBasket(basketID uint) error
	UpdateBasketItemQuantity(userID, autoPartID uint, quantity uint) error
	RemoveAllItems(basketID uint) error
}

type basketRepo struct {
	db *gorm.DB
}

func NewBasketRepo(db *gorm.DB) BasketRepo {
	return &basketRepo{db: db}
}

func (r *basketRepo) Create(basket *model.Basket) error {
	return r.db.Create(&basket).Error
}

func (r *basketRepo) GetBasketByUserID(userID uint) (*model.Basket, error) {
	var basket model.Basket
	result := r.db.Where("user_id = ?", userID).Preload("BasketItems").Preload("BasketItems.AutoPart").First(&basket)
	if result.Error != nil {
		return nil, result.Error
	}
	return &basket, nil
}

// Добавление товара в корзину пользователя
func (r *basketRepo) AddItemToBasket(userID uint, item model.BasketItem) error {
	// Проверка, существует ли корзина пользователя
	var basket model.Basket
	if err := r.db.Where("user_id = ?", userID).First(&basket).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Если корзины нет, создаем новую
			basket = model.Basket{UserID: userID}
			if err := r.db.Create(&basket).Error; err != nil {
				return err
			}
		} else {
			return err
		}
	}

	// Добавление товар в корзину
	item.BasketID = basket.ID
	return r.db.Create(&item).Error
}

func (r *basketRepo) UpdateBasketItem(itemID uint, newItem model.BasketItem) error {
	return r.db.Model(&model.BasketItem{}).Where("id = ?", itemID).Updates(newItem).Error
}

func (r *basketRepo) RemoveItemFromBasket(itemID uint) error {
	var basketItem model.BasketItem
	return r.db.Delete(basketItem, itemID).Error
}

func (r *basketRepo) ClearBasket(basketID uint) error {
	return r.db.Where("basket_id = ?", basketID).Delete(&model.BasketItem{}).Error
}

func (r *basketRepo) UpdateBasketItemQuantity(userID, autoPartID uint, quantity uint) error {
	var basket model.Basket
	if err := r.db.Where("user_id = ?", userID).First(&basket).Error; err != nil {
		return err
	}

	var basketItem model.BasketItem
	if err := r.db.Where("basket_id = ? AND auto_part_id = ?", basket.ID, autoPartID).First(&basketItem).Error; err != nil {
		return err
	}

	basketItem.Quantity = quantity
	return r.db.Save(&basketItem).Error
}

func (r *basketRepo) RemoveAllItems(basketID uint) error {
	return r.db.Where("basket_id = ?", basketID).Delete(&model.BasketItem{}).Error
}
