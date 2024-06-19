package repo

import (
	"errors"
	"log"
	"shop-server/internal/model"
	"strings"

	"gorm.io/gorm"
)

type AutoPartRepo interface {
	Create(product *model.AutoPart) error
	GetAll() ([]model.AutoPart, error)
	GetByID(id uint) (*model.AutoPart, error)
	Update(product model.AutoPart, fieldsToUpdate map[string]interface{}) error
	Delete(id uint) error
	GetStock(id uint) (uint, error)
	UpdateStock(id uint, quantity int) error
	Exists(id uint) (bool, error)
	Search(query string) ([]model.AutoPart, error)
	FindByModelAndYear(modelName string, year int) ([]model.AutoPart, error)
}

type autoPartRepo struct {
	db *gorm.DB
}

func NewAutoPartRepo(db *gorm.DB) AutoPartRepo {
	return &autoPartRepo{db: db}
}

func (ar *autoPartRepo) Create(autoPart *model.AutoPart) error {
	return ar.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(autoPart).Error; err != nil {
			return err
		}

		if len(autoPart.Categories) > 0 {
			if err := tx.Model(autoPart).Association("Categories").Replace(autoPart.Categories); err != nil {
				return err
			}
		}

		if len(autoPart.ModelAutos) > 0 {
			if err := tx.Model(autoPart).Association("ModelAutos").Replace(autoPart.ModelAutos); err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *autoPartRepo) GetAll() ([]model.AutoPart, error) {
	var autoParts []model.AutoPart
	if err := r.db.Preload("Categories").Preload("Brand").Preload("AutoPartInfo").Find(&autoParts).Error; err != nil {
		return nil, err
	}
	return autoParts, nil
}

func (ar *autoPartRepo) GetByID(id uint) (*model.AutoPart, error) {
	var product model.AutoPart
	if err := ar.db.First(&product, id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (ar *autoPartRepo) Update(product model.AutoPart, fieldsToUpdate map[string]interface{}) error {
	var existingProduct model.AutoPart
	if err := ar.db.Preload("Categories").First(&existingProduct, product.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("record not found")
		}
		return err
	}

	// Update categories if provided
	if categories, ok := fieldsToUpdate["categories"].([]uint); ok {
		var newCategories []model.Category
		if err := ar.db.Where("id IN ?", categories).Find(&newCategories).Error; err != nil {
			return err
		}
		if err := ar.db.Model(&existingProduct).Association("Categories").Replace(newCategories); err != nil {
			return err
		}
		delete(fieldsToUpdate, "categories")
	}

	if brandID, ok := fieldsToUpdate["brand_id"].(uint); ok {
		existingProduct.BrandID = brandID
		delete(fieldsToUpdate, "brand_id")
	}

	if len(fieldsToUpdate) > 0 {
		if err := ar.db.Model(&existingProduct).Updates(fieldsToUpdate).Error; err != nil {
			return err
		}
	}

	return nil
}

func (ar *autoPartRepo) Delete(id uint) error {
	return ar.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("auto_part_id = ?", id).Delete(model.AutoPartCategory{}).Error; err != nil {
			return err
		}

		if err := tx.Delete(&model.AutoPart{}, id).Error; err != nil {
			return err
		}

		return nil
	})
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
	var products []model.AutoPart

	// Разбиваем запрос на отдельные слова
	terms := strings.Fields(query)
	likeClauses := make([]string, len(terms))
	likeValues := make([]interface{}, len(terms)*4) // 4 - количество полей для проверки

	for i, term := range terms {
		likeClauses[i] = `(auto_parts.name ILIKE ? OR categories.name ILIKE ? OR brands.name ILIKE ? OR auto_parts.model_name ILIKE ?)`
		for j := 0; j < 4; j++ {
			likeValues[i*4+j] = "%" + term + "%"
		}
	}

	// Формируем окончательный WHERE запрос
	whereClause := strings.Join(likeClauses, " AND ")

	if err := r.db.Table("auto_parts").
		Select("auto_parts.*, array_agg(categories.name) AS category_names, brands.name AS brand_name").
		Joins("LEFT JOIN auto_part_categories ON auto_parts.id = auto_part_categories.auto_part_id").
		Joins("LEFT JOIN categories ON auto_part_categories.category_id = categories.id").
		Joins("LEFT JOIN brands ON auto_parts.brand_id = brands.id").
		Where(whereClause, likeValues...).
		Group("auto_parts.id, brands.name").
		Find(&products).Error; err != nil {
		// Логирование ошибки
		log.Printf("Error searching auto parts: %v", err)
		return nil, err
	}
	return products, nil

}

func (ar *autoPartRepo) FindByModelAndYear(modelName string, year int) ([]model.AutoPart, error) {
	var autoParts []model.AutoPart

	err := ar.db.
		Table("auto_parts").
		Select("auto_parts.*, model_autos.name AS model_name").
		Joins("JOIN model_auto_auto_parts ON auto_parts.id = model_auto_auto_parts.auto_part_id").
		Joins("JOIN model_autos ON model_auto_auto_parts.model_auto_id = model_autos.id").
		Where("auto_parts.for_years @> ?", []int{year}).
		Where("model_autos.name = ?", modelName).
		Find(&autoParts).Error

	if err != nil {
		log.Printf("Error finding auto parts by model and year: %v", err)
		return nil, err
	}

	return autoParts, nil
}


