package database

import (
	"server/internal/models"

	"gorm.io/gorm"
)

func AutoMigrateModels(db *gorm.DB) error {
	err := db.AutoMigrate(
		&models.RegisterData{},
		&models.User{},
		&models.Token{},
		&models.LoginData{},
	)
	if err != nil {
		return err
	}

	db.Model(&models.Token{}).Association("User")

	return nil
}
