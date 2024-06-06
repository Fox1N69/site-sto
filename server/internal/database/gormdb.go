package database

import (
	"server/internal/models"

	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func GetGormDB() *gorm.DB {
	dsn := "user=postgres password=8008 dbname=remzona port=5432 sslmode=disable"
	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logrus.Fatal("Error connect to database: ", err)
	}
	logrus.Info("Database connected!")

	DB.AutoMigrate(&models.Shop{})
	if err := DB.AutoMigrate(&models.Customer{}, &models.Category{}, &models.Product{}, &models.Order{}, &models.OrderItem{}); err != nil {
		logrus.Fatal("Error migrate database: ", err)
	} else {
		logrus.Info("Database migrated!")
	}

	AutoMigrateModels(DB)

	return DB
}
