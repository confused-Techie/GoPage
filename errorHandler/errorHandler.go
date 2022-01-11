package errorHandler

import (
	"fmt"
	"github.com/spf13/viper"
	"html/template"
	"net/http"
)

// PageLoadError is for errors that occur loading whole pages.
func PageLoadError(w http.ResponseWriter, err error) {
	if err != nil {
		fmt.Println(err)
		t, errT := template.ParseFiles(viper.GetString("directories.templates") + "/error.html")
		if errT != nil {
			fmt.Println(errT)
		}
		t.Execute(w, err)
		return
	}
	return
}

func JSONLoadError(w http.ResponseWriter, err error) {
	if err != nil {
		fmt.Println(err)
	}
	return
}

func StandardError(err error) {
	if err != nil {
		fmt.Println(err)
	}

}
