package repo

import (
	"shop-server/internal/model"

	"gorm.io/gorm"
)

type AutoPartRepo interface {
	Create(product model.AutoPart) error
	GetAll() ([]model.AutoPart, error)
	GetByID(id uint) (*model.AutoPart, error)
	Update(product model.AutoPart) error
	Delete(id uint) error
	GetStock(id uint) (uint, error)
	UpdateStock(id uint, quantity int) error
	Exists(id uint) (bool, error)
	Search(query string) ([]model.AutoPart, error)
}

type autoPartRepo struct {
	db *gorm.DB
}

func NewAutoPartRepo(db *gorm.DB) AutoPartRepo {
	return &autoPartRepo{db: db}
}

func (ar *autoPartRepo) Create(product model.AutoPart) error {
	return ar.db.Create(&product).Error
}

func (ar *autoPartRepo) GetAll() ([]model.AutoPart, error) {
	var product []model.AutoPart
	if err := ar.db.Find(&product).Error; err != nil {
		return nil, err
	}
	return product, nil
}

func (ar *autoPartRepo) GetByID(id uint) (*model.AutoPart, error) {
	var product model.AutoPart
	if err := ar.db.First(&product, id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (ar *autoPartRepo) Update(product model.AutoPart) error {
	return ar.db.Save(&product).Error
}

func (ar *autoPartRepo) Delete(id uint) error {
	return ar.db.Delete(&model.AutoPart{}, id).Error
}

func (ar *autoPartRepo) UpdateStock(id uint, quantity int) error {
	return ar.db.Model(&model.AutoPart{}).Where("id = ?", id).Update("stock", gorm.Expr("stock + ?", quantity)).Error
}

func (ar *autoPartRepo) GetStock(id uint) (uint, error) {
	var autoPart model.AutoPart
	if err := ar.db.Select("stock").Where("id = ?", id).First(&autoPart).Error; err != nil {
		return 0, err
	}
	return autoPart.Stock, nil
}

func (r *autoPartRepo) Exists(id uint) (bool, error) {
	var count int64
	if err := r.db.Model(&model.AutoPart{}).Where("id = ?", id).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *autoPartRepo) Search(query string) ([]model.AutoPart, error) {
	var product []model.AutoPart

	if err := r.db.Table("auto_parts").
		Select("auto_parts.*, categories.name AS category_name, brands.name AS brand_name").
		Joins("JOIN categories ON auto_parts.category_id = categories.id").
		Joins("JOIN brands ON auto_parts.brand_id = brands.id").
		Where("auto_parts.name ILIKE ? OR categories.name ILIKE ? OR brands.name ILIKE ? OR model_name ILIKE ?", "%"+query+"%", "%"+query+"%", "%"+query+"%", "%"+query+"%").
		Find(&product).Error; err != nil {
		return nil, err
	}
	return product, nil
}
