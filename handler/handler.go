package handler

import (
	"encoding/json"
	"fmt"
	modifySettings "github.com/confused-Techie/GoPage/modifySettings"
	model "github.com/confused-Techie/GoPage/model"
	errorHandler "github.com/confused-Techie/GoPage/errorHandler"
	apiFunc "github.com/confused-Techie/GoPage/apiFunc"
	"github.com/spf13/viper"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"html/template"
)


// Here Will be attempted to include standard Page handlers

//HomePageHandler returns Template: homePage.html w/ Model: Home
func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	au := model.Home()
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/homePage.html")
	errorHandler.PageLoadError(w, err)
	t.Execute(w, au)
}

// SettingsPageHandler returns Template: settings.html w/ Model: ServSettingGet
func SettingsPageHandler(w http.ResponseWriter, r *http.Request) {
	au := model.ServSettingGet()
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/settings.html")
	errorHandler.PageLoadError(w, err)
	t.Execute(w, au)
}

// PluginRepoHandler returns Template: pluginRepo.html w/ Data: apiFunc.GetPluginData
func PluginRepoPageHandler(w http.ResponseWriter, r *http.Request) {
	resp := apiFunc.GetPluginData()
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/pluginRepo.html")
	errorHandler.PageLoadError(w, err)
	t.Execute(w, resp)
}

// LinkHealthPageHandler returns basic page data w/ no template. Page: linkhealth.html
func LinkHealthPageHandler(w http.ResponseWriter, r *http.Request) {
	p := viper.GetString("directories.templates") + "/linkhealth.html"
	http.ServeFile(w, r, p)
}

// UploadHandler is paired to http.HandleFunc("/upload", ) to handle the digestion of image uploads to GoPage
func UploadHandler(w http.ResponseWriter, r *http.Request) {
	// Parse our multipart form, 10 << 20 specifies a mazimum upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)
	//FormFile returns the first file for the given key 'myFile'
	// it also returns the fileheader so we can get the fielname,
	// the header and the size of the file
	file, handler, err := r.FormFile("myFile")
	if err != nil {
		fmt.Println("Error Retrieving the File...")
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	// Create a temporary file within our temp-images directory that follows
	// a particular naming pattern
	tempFile, err := ioutil.TempFile(viper.GetString("directories.staticAssets")+"userImages", "upload-*.png")
	if err != nil {
		fmt.Println(err)
	}
	defer tempFile.Close()

	// read all of the contents of our uploaded file into a byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}
	// write this byte array to our temporary file
	tempFile.Write(fileBytes)
	// return that we have successfully uploaded our file
	fmt.Println("Successfully Uploaded File")

	// After successfully uploading the file, redirect to the home page
	http.Redirect(w, r, "/uploadpage", 301)
}

// ChangeLang is an API Endpoint to modify the server language whenever needed.
func ChangeLang(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["lang"]
	if !ok || len(keys[0]) < 1 {
		fmt.Println("URL Param 'lang' is missing")
		json.NewEncoder(w).Encode("URL Param 'lang' is missing")
	}
	newLang := keys[0]

	modifySettings.SetLangEnv(newLang)
	resp, err := modifySettings.DetermineLang()

	if err != nil {
		fmt.Println("Error Occurred when setting Lang: ", err)
		json.NewEncoder(w).Encode("Error Occurred when setting Lang")
	}
	json.NewEncoder(w).Encode(resp)
}

// DeleteLinkItem is an API Handler alternative to the post handler of deleting Link Items
func DeleteLinkItem(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/api/deletelink/"):]
	i, err := strconv.Atoi(id)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	// open file with items
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}
	defer file.Close()

	// read file and unmarshall json to []items
	b, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}
	var alItms model.AllItems
	err = json.Unmarshal(b, &alItms.Items)
	if err != nil {
		fmt.Println(err)
	}

	for u, itm := range alItms.Items {
		if itm.Id == i {
			alItms.Items = append(alItms.Items[:u], alItms.Items[u+1:]...)
		}
	}

	newItemBytes, err := json.MarshalIndent(&alItms.Items, "", " ")
	if err != nil {
		fmt.Println(err)
	}

	ioutil.WriteFile(viper.GetString("directories.data"), newItemBytes, 0666)
	json.NewEncoder(w).Encode("Success")
}
