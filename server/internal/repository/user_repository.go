package repository

import (
	"errors"
	"server/internal/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
					// Если запись не найдена, возвращаем nil
					return nil, nil
			}
			// Если произошла другая ошибка, возвращаем её
			return nil, err
	}
	// Если пользователь найден, возвращаем его
	return &user, nil
}

func (r *UserRepository) SaveRefreshToken(id uint, refreshToken string) error {
	if result := r.db.Model(&models.Token{}).Where("id = ?", id).Update("refresh_token", refreshToken); result.Error != nil {
		return result.Error
	}

	return nil
}
