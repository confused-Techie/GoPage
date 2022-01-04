package config

import (
	"flag"
	"fmt"
	"github.com/spf13/viper"
	"os"
	"runtime"
	model "github.com/confused-Techie/GoPage/model"
	modifySettings "github.com/confused-Techie/GoPage/modifySettings"
)

// Config is a struct to contain the full config.yml file with multiple sections
type Config struct {
	Server      ServerConfigurations
	Directories DirectoriesConfigurations
}

// ServerConfigurations struct contains the options within the yaml specific to the server
type ServerConfigurations struct {
	Port int
}

// DirectoriesConfigurations struct contains the options within the yaml specific to the location of other data
type DirectoriesConfigurations struct {
	StaticAssets string
	Templates    string
	Data         string
	Plugin       string
	Script       string
}

// LoadConfig is needed for viper to load the config file
func LoadConfig(path string) (config Config, err error) {
	// set the path to look for the configuration file
	// this will be provided when calling the func
	viper.AddConfigPath(path)
	// name for the config file
	viper.SetConfigName("config")
	// se the type of config
	viper.SetConfigType("yml")

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	// As a backup we can try to unmarshal the raw data into the config object
	err = viper.Unmarshal(&config)
	return
}

// DetermineEnv helps to determine the location of the config file based on platform or flags during running of GoPage
func DetermineEnv() string {
	devEnv := flag.Bool("dev", false, "a bool")
	dockerEnv := flag.Bool("docker", false, "a bool")
	langEnv := flag.String("lang", "", "a string")
	flag.Parse()

	modifySettings.SetLangEnv(*langEnv)

	if *devEnv {
		return "."
	}
	if *dockerEnv {
		return "."
	}

	if runtime.GOOS == "windows" {
		//return os.Getenv("HOMEDRIVE") + os.Getenv("HOMEPATH") + "/.gopage"
		return os.Getenv("LOCALAPPDATA") + "/.gopage"
	}
	// Since this if block ends with a return statement, dropping the else and outdenting the block.
	// once additional platforms are supported this will need to be modified,
	return "$HOME"

}
