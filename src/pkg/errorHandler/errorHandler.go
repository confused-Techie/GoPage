package errorHandler

import (
	"encoding/json"
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

// JSONLoadError is for errors occuring when intended to return JSON. TODO: Return properly
func JSONLoadError(w http.ResponseWriter, err error) {
	if err != nil {
		fmt.Println(err)
	}
	return
}

// StandardError is for items that just need errors loged and no special handling.
func StandardError(err error) {
	if err != nil {
		fmt.Println(err)
	}

}

// JSONReturnError is for errors that need to return as json, to respond to the request
func JSONReturnError(w http.ResponseWriter, err error) {
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
	}
}
