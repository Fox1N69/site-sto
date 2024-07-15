package config

import (
	"errors"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

type Config interface {
	Config() *viper.Viper
	SetMode() string
}

type config struct {
	configFile string
}

func LoadConfig(configFile string) Config {
	return &config{configFile: configFile}
}

var (
	viperOnce sync.Once
	vipe      *viper.Viper
)

func (c *config) Config() *viper.Viper {
	const op = "internal.config.Config()"

	viperOnce.Do(func() {
		viper.SetConfigFile(c.configFile)
		if err := viper.ReadInConfig(); err != nil {
			logrus.Fatal("%s %w", op, err)
		}

		vipe = viper.GetViper()
	})

	return vipe
}

var (
	modeOnce    sync.Once
	mode        string
	development = "dev"
	production  = "release"
)

func (c *config) SetMode() string {
	modeOnce.Do(func() {
		env := c.Config().Sub("environment").GetString("mode")
		if env == development {
			mode = gin.DebugMode
		} else if env == production {
			mode = gin.ReleaseMode
		} else {
			logrus.Fatalf("[infa][SetMode] %v", errors.New("environment not setup"))
		}

		gin.SetMode(mode)
	})

	return mode
}
