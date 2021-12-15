package config

import (
  "github.com/spf13/viper"
  "os"
  "runtime"
  "flag"
  "fmt"
)

type Config struct {
  Server ServerConfigurations
  Directories DirectoriesConfigurations
}

type ServerConfigurations struct {
  Port int
}

type DirectoriesConfigurations struct {
  StaticAssets string
  Templates string
  Data string
  Plugin string
  Script string
}

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

func DetermineEnv() string {
  devEnv := flag.Bool("dev", false, "a bool")
  dockerEnv := flag.Bool("docker", false, "a bool")
  flag.Parse()

fmt.Println("App Data Test: \t" + os.Getenv("LOCALAPPDATA"))
  if *devEnv {
    return "."
  }
  if *dockerEnv {
    return "."
  }

  if runtime.GOOS == "windows" {
    //return os.Getenv("HOMEDRIVE") + os.Getenv("HOMEPATH") + "/.gopage"
    return os.Getenv("LOCALAPPDATA") + "/.gopage"
  } else {
    return "$HOME"
  }
}
