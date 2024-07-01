package repo

import (
	"log"
	"shop-server/internal/model"
	"strconv"
	"strings"

	"gorm.io/gorm"
)

type AutoRepo interface {
	Create(auto *model.ModelAuto) error
	GetAll() ([]model.ModelAuto, error)
	GetByID(id uint) (*model.ModelAuto, error)
	GetByBrandID(brandID uint) ([]model.ModelAuto, error)
	Update(auto *model.ModelAuto) error
	Delete(id uint) error
	SearchModelAuto(query string) ([]model.ModelAuto, error)
}

type autoRepo struct {
	db        *gorm.DB
	brandRepo BrandRepo
}

func NewAutoRepo(db *gorm.DB) AutoRepo {
	return &autoRepo{db: db, brandRepo: NewBrandRepo(db)}
}

func (r *autoRepo) Create(auto *model.ModelAuto) error {
	if err := r.db.Create(&auto).Error; err != nil {
		return err
	}

	// Предварительная загрузка связанных данных о бренде
	if err := r.db.Preload("Brand").First(&auto, auto.ID).Error; err != nil {
		return err
	}

	return nil
}

func (r *autoRepo) GetAll() ([]model.ModelAuto, error) {
	var modelAuto []model.ModelAuto
	if err := r.db.Preload("Brand").Find(&modelAuto).Error; err != nil {
		return nil, err
	}
	return modelAuto, nil
}

func (r *autoRepo) GetByID(id uint) (*model.ModelAuto, error) {
	var model model.ModelAuto
	if err := r.db.Where("id = ?", id).First(&model).Error; err != nil {
		return nil, err
	}

	return &model, nil
}

func (r *autoRepo) GetByBrandID(brandID uint) ([]model.ModelAuto, error) {
	var modelAuto []model.ModelAuto

	if err := r.db.Preload("Brand").Where("brand_id = ?", brandID).Find(&modelAuto).Error; err != nil {
		return nil, err
	}

	return modelAuto, nil
}

func (r *autoRepo) Update(auto *model.ModelAuto) error {
	return r.db.Session(&gorm.Session{FullSaveAssociations: true}).Updates(auto).Error
}

func (r *autoRepo) Delete(id uint) error {
	return r.db.Where("id = ?", id).Delete(&model.ModelAuto{}).Error
}

func (r *autoRepo) SearchModelAuto(query string) ([]model.ModelAuto, error) {
	var models []model.ModelAuto

	terms := strings.Fields(query)
	likeClauses := make([]string, len(terms))
	likeValues := make([]interface{}, len(terms)*2) // Note the change here

	for i, term := range terms {
		likeClauses[i] = `(model_autos.name ILIKE ? OR brands.name ILIKE ?)`
		for j := 0; j < 2; j++ {
			likeValues[i*2+j] = "%" + term + "%"
		}
	}

	whereClause := strings.Join(likeClauses, " AND ")

	queryString := r.db.Model(&model.ModelAuto{}).
		Preload("AutoPart").
		Joins("LEFT JOIN brands ON model_autos.brand_id = brands.id").
		Where(whereClause, likeValues...)

	// Check if the query can be converted to an integer for release_year JSONB search
	if _, err := strconv.Atoi(query); err == nil {
		queryString = queryString.Or("model_autos.release_year @> ?", `[`+query+`]`)
	}

	if err := queryString.Find(&models).Error; err != nil {
		log.Printf("Error searching model autos: %v", err)
		return nil, err
	}

	return models, nil
}
