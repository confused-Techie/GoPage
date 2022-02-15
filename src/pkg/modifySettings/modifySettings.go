package modifySettings

import (
	"fmt"
	model "github.com/confused-Techie/GoPage/src/pkg/model"
)

var commandLineString string
var commandLineLogging string

// DetermineLang is called by Main() in GoPage.go to check the global var commandLineString in modifySettings and
// if defined pass it to model.go
func DetermineLang() (string, error) {

	// Had to move DetermineLang to a new function since placing it with the DetermineConfig
	// caused the model.ServSettingSetLang to try and read a non-existent config
	if commandLineString != "" {
		fmt.Println("Checking Declared Language against default.")
		resp, err := model.ServSettingSetLang(commandLineString)
		if err != nil {
			return "", err
		}
		return resp, nil
	}

	return "Server Language Not Specified, Defaulting to English", nil
}

// DetermineLogging takes no arguments, which invokes model.ServSettingSetLogging with the scoped global variable
// commandLineLogging to set that variable as the saved one, or continue with the default logging method 
func DetermineLogging() (string, error) {
	if commandLineLogging != "" {
		fmt.Println("Checking Declared Logging against default.")
		resp, err := model.ServSettingSetLogging(commandLineLogging)
		if err != nil {
			return "", err
		}
		return resp, nil
	}

	return "Server Logging Not Specified, Defaulting to Custom", nil
}

// SetLangEnv is to receive the command line specified language from config.go
func SetLangEnv(provided string) {
	commandLineString = provided
}

// SetLoggingEnv receives the command line string from config.go DetermineEnv
func SetLoggingEnv(provided string) {
	commandLineLogging = provided
}
