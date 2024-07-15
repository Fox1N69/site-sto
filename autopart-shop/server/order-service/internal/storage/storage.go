package storage

import (
	"fmt"
	"order-service/internal/config"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Storage interface {
	GormDB() *gorm.DB
	Migrate(values ...interface{})
}

type storage struct {
	config config.Config
}

func NewStorage(config config.Config) Storage {
	return &storage{config: config}
}

var (
	grmOnce sync.Once
	grm     *gorm.DB
)

func (s *storage) GormDB() *gorm.DB {
	grmOnce.Do(func() {
		config := s.config.Config().Sub("database")
		user := config.GetString("user")
		pass := config.GetString("pass")
		host := config.GetString("host")
		port := config.GetString("port")
		name := config.GetString("name")

		dns := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pass, host, port, name)
		db, err := gorm.Open(postgres.Open(dns), &gorm.Config{})
		if err != nil {
			logrus.Fatalf("[infra][GormDB][gorm.Open] %v", err)
		}

		sqlDB, err := db.DB()
		if err != nil {
			logrus.Fatalf("[infra][GormDB][db.DB] %v", err)
		}

		if err := sqlDB.Ping(); err != nil {
			logrus.Fatalf("[infra][GormDB][sqlDB.Ping] %v", err)
		}

		sqlDB.SetMaxOpenConns(100)
		sqlDB.SetConnMaxLifetime(time.Hour)

		grm = db
	})

	return grm
}

var (
	migrateOnce sync.Once
)

func (s *storage) Migrate(values ...interface{}) {
	migrateOnce.Do(func() {
		if s.config.SetMode() == gin.DebugMode {
			if err := s.GormDB().Debug().AutoMigrate(values...); err != nil {
				logrus.Fatalf("[infra][Migrate][GormDB.Debug.AutoMigrate] %v", err)
			}
		} else if s.config.SetMode() == gin.ReleaseMode {
			if err := s.GormDB().AutoMigrate(values...); err != nil {
				logrus.Fatalf("[infra][Migrate][GormDB.AutoMigrate] %v", err)
			}
		}
	})
}
