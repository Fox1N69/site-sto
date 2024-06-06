package models

type RegisterData struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username" gorm:"unique"`
	Email     string    `json:"email" gorm:"unique"`
	Password  []byte    `json:"hashPassword"`
	LoginData LoginData `json:"-"`
}

type User struct {
	UserID         uint   `json:"id" gorm:"primaryKey;autoIncrement" `
	Username       string `json:"username"`
	Password       []byte `json:"password"`
	IsActivated    bool   `json:"is_activated"`
	ActivationLink string `json:"activation_link"`
	FullName       string `json:"full_name"`
	Email          string `json:"email"`
	DateOfBirth    string `json:"date_of_birth"`
	Location       string `json:"location"`
	Role           string `json:"role"` // Например: "admin", "user", "moderator" и т.д.
	Permissions    string `json:"permissions"`
}

type Token struct {
	UserID       uint   `json:"id" gorm:"foreignKey:UserID;references:UserID"`
	RefreshToken []byte `json:"refreshToken"`
}

type LoginData struct {
	ID             uint   `json:"id"`
	RegisterDataID uint   `json:"register_data_id"`
	Email          string `json:"email"`
	Password       []byte `json:"hashPassword"`
}
