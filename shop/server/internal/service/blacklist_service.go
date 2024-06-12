package service

import (
	"time"
)

type BlacklistService interface {
	AddToBlacklist(tokenString string, duration time.Duration) error
	IsBlacklisted(tokenString string) bool
}

type blacklistService struct {
	blacklistedTokens map[string]time.Time
}

func NewBlacklistService() BlacklistService {
	return &blacklistService{
		blacklistedTokens: make(map[string]time.Time),
	}
}

func (s *blacklistService) AddToBlacklist(tokenString string, duration time.Duration) error {
	// Добавить токен в черный список с указанием времени истечения срока его действия
	s.blacklistedTokens[tokenString] = time.Now().Add(duration)
	return nil
}

func (s *blacklistService) IsBlacklisted(tokenString string) bool {
	// Проверить, есть ли токен в черном списке
	expirationTime, ok := s.blacklistedTokens[tokenString]
	if !ok {
		return false // Токен не найден в черном списке
	}
	// Если токен найден в черном списке, проверить, истек ли срок его действия
	if time.Now().Before(expirationTime) {
		return true // Токен находится в черном списке и еще не истек
	}
	// Удалить токен из черного списка после истечения срока его действия
	delete(s.blacklistedTokens, tokenString)
	return false
}
