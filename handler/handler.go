package handler

import (
	"encoding/json"
	"fmt"
	apiFunc "github.com/confused-Techie/GoPage/apiFunc"
	errorHandler "github.com/confused-Techie/GoPage/errorHandler"
	model "github.com/confused-Techie/GoPage/model"
	modifySettings "github.com/confused-Techie/GoPage/modifySettings"
	"github.com/spf13/viper"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

// Here Will be attempted to include standard Page handlers

//HomePageHandler returns Template: homePage.html w/ Model: Home
func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	//au := model.Home()
	au := model.HomeV2()
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/homePage.html")
	fmt.Println(err)
	errorHandler.PageLoadError(w, err)
	templateErr := t.Execute(w, au)
	errorHandler.StandardError(templateErr)
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

// ------------ User Settings Modifiers

// UserSettingSet is user to write new user settings to disk
func UserSettingSet(rw http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	errorHandler.JSONLoadError(rw, err)
	var upldUsr model.UserSetting
	err = json.Unmarshal(body, &upldUsr)
	errorHandler.JSONLoadError(rw, err)
	// now after confirming the data can be unmarshalled into the struct, we can write it
	newUserSetting, err := json.MarshalIndent(&upldUsr, "", "")
	errorHandler.JSONLoadError(rw, err)
	ioutil.WriteFile(viper.GetString("directories.setting")+"/userSettings.json", newUserSetting, 0666)
	json.NewEncoder(rw).Encode("Success")
}

// ---------------- Link Item Handlers

// AddLinkItem is a JSON Handler for adding Link Items as opposed to the original Form based method
func AddLinkItem(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// here is were I would need to check for required form values
		body, err := ioutil.ReadAll(r.Body)
		errorHandler.JSONLoadError(w, err)
		var newLinkItem model.ItemV2
		// unmarshal the body json data into the model, so that we can work with the model later
		err = json.Unmarshal(body, &newLinkItem)
		errorHandler.JSONLoadError(w, err)
		// Now after confirming the data cna be unmarshalled into the struct, we can marshal it properly
		//newLinkItem, err := json.MarshalIndent(&newItem, "", "")
		//errorHandler.JSONLoadError(w, err)

		// now to grab the existing json file
		file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
		errorHandler.JSONLoadError(w, err)
		defer file.Close()

		// unmarshal the existing data
		bytes, err := ioutil.ReadAll(file)
		errorHandler.JSONLoadError(w, err)
		var allItems model.AllItemsV2
		err = json.Unmarshal(bytes, &allItems.Items)
		errorHandler.JSONLoadError(w, err)

		// then to generate an id(last id at the json file+1)
		max := 0

		for _, itm := range allItems.Items {
			if itm.ID > max {
				max = itm.ID
			}
		}
		id := max + 1
		newLinkItem.ID = id

		// appending newLinkItem to slice of all Items and rewrite the json file
		allItems.Items = append(allItems.Items, &newLinkItem)
		newItemBytes, err := json.MarshalIndent(&allItems.Items, "", " ")
		errorHandler.JSONLoadError(w, err)
		ioutil.WriteFile(viper.GetString("directories.data"), newItemBytes, 0666)
		// now with everything written, we can return the JSON data
		json.NewEncoder(w).Encode("Success")

	} else {
		fmt.Println("Non-Post Request submitted to POST Only JSON AddLinkItem Handler.")
		json.NewEncoder(w).Encode("Non-Post Request submitted to POST Only JSON AddLinkItem Handler.")
	}
}

func EditLinkItem(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// here is where I could check for required form values, but hopefully this will be done in js
		body, err := ioutil.ReadAll(r.Body)
		errorHandler.JSONLoadError(w, err)
		var updateItem model.ItemV2
		// Unmarshal the body json data into the model, so that we can work with the model later
		err = json.Unmarshal(body, &updateItem)
		errorHandler.JSONLoadError(w, err)
		// now grab the exisitng json file
		file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
		errorHandler.JSONLoadError(w, err)
		defer file.Close()

		// unmarshal the exisitng data
		bytes, err := ioutil.ReadAll(file)
		errorHandler.JSONLoadError(w, err)
		var allItms model.AllItemsV2
		err = json.Unmarshal(bytes, &allItms.Items)
		errorHandler.JSONLoadError(w, err)

		// now to loop through the existing data till we find the matching ID, then reassign the exisitng data in memory
		for i, itm := range allItms.Items {
			if itm.ID == updateItem.ID {
				allItms.Items[i].FriendlyName = updateItem.FriendlyName
				allItms.Items[i].Link = updateItem.Link
				allItms.Items[i].Category = updateItem.Category
				allItms.Items[i].Plugins = updateItem.Plugins
			}
		}

		newItemBytes, err := json.MarshalIndent(&allItms.Items, "", " ")
		errorHandler.JSONLoadError(w, err)
		ioutil.WriteFile(viper.GetString("directories.data"), newItemBytes, 0666)
		// now with everything written, we can return the JSON data
		json.NewEncoder(w).Encode("Success")

	} else {
		fmt.Println("Non-Post Request submitted to POST Only JSON EditLinkItem Handler.")
		json.NewEncoder(w).Encode("Non-Post Request submitted to POST Only JSON EditLinkItem Handler.")
	}
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
