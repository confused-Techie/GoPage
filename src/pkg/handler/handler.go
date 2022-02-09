package handler

import (
	"encoding/json"
	"fmt"
	apiFunc "github.com/confused-Techie/GoPage/src/pkg/apiFunc"
	errorHandler "github.com/confused-Techie/GoPage/src/pkg/errorHandler"
	model "github.com/confused-Techie/GoPage/src/pkg/model"
	modifySettings "github.com/confused-Techie/GoPage/src/pkg/modifySettings"
	universalMethods "github.com/confused-Techie/GoPage/src/pkg/universalMethods"
	"github.com/spf13/viper"
	"html"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

// ------------ Standard Page Handlers

func returnDynamicTemplate(t string) string {
	return viper.GetString("directories.templates") + t
}

func returnDynamicSubTemplate(t string) string {
	return viper.GetString("directories.templates") + "/components/" + t
}

func returnAgnosticStrings(langCode string) map[string]string {
	// While original was using map[string]interface{} as was thought to be the best for mapping unknown JSON
	// Since I do know that the translations should only ever include strings, we can make a small attempt
	// at ensuring the strings file doesn't become a vector for malicious activity

	file, err := os.OpenFile(viper.GetString("directories.staticAssets")+"lang/strings."+langCode+".json", os.O_RDWR|os.O_APPEND, 0666)
	errorHandler.StandardError(err)
	b, err := ioutil.ReadAll(file)
	errorHandler.StandardError(err)
	var objmap map[string]string
	err = json.Unmarshal(b, &objmap)
	errorHandler.StandardError(err)
	return objmap
}

func returnTargetStrings() map[string]string {

	var targetLangCode = model.ServSettingGetLang()

	return returnAgnosticStrings(targetLangCode)
}

func returnDefaultStrings() map[string]string {
	return returnAgnosticStrings("en")
}

var tmpl = make(map[string]*template.Template)

//HomePageHandler returns Template: homePage.html w/ Model: HomeV2
func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	au := model.HomeV2()

	data := model.PageTemplate{
		Title:          "Gopage - Home",
		Theme:          "/assets/css/theme-dark.css",
		CSS:            []string{"/assets/css/dist/universal.min.css", "/assets/css/dist/home.min.css"},
		JS:             []string{"/assets/js/universe.js", "/assets/js/langHandler.js", "/assets/js/home.js", "/assets/js/pluginhandler.js", "/assets/js/universal.js"},
		Data:           au,
		TargetStrings:  returnTargetStrings(),
		DefaultStrings: returnDefaultStrings(),
		TargetLanguage: model.ServSettingGetLang(),
	}

	templateArray := []string{
		returnDynamicTemplate("homePage.gohtml"),
		returnDynamicSubTemplate("heading.gohtml"),
		returnDynamicSubTemplate("footer.gohtml"),
		returnDynamicSubTemplate("head.gohtml"),
		returnDynamicSubTemplate("noscript.gohtml"),
		returnDynamicSubTemplate("modal.gohtml"),
		returnDynamicSubTemplate("snackbar.gohtml"),
		returnDynamicSubTemplate("firstTimeSetup.gohtml"),
		returnDynamicSubTemplate("returnsGlobalJS.gohtml"),
	}

	// this is using the variadic nature of ParseFiles to advantage, to instead of endless returns for each template,
	// they can be dynamically returned via a simple constructor, then passed as an array to ParseFiles

	tmpl["homePage.html"] = template.Must(template.ParseFiles(templateArray...))
	templateError := tmpl["homePage.html"].Execute(w, data)
	errorHandler.StandardError(templateError)
}

// SettingsPageHandler returns Template: settings.html w/ Model: ServSettingGet
func SettingsPageHandler(w http.ResponseWriter, r *http.Request) {
	au := model.FullServSettingGet()

	data := model.PageTemplate{
		Title:          "GoPage - Settings",
		Theme:          "/assets/css/theme-dark.css",
		CSS:            []string{"/assets/css/dist/universal.min.css", "/assets/css/dist/settings.min.css"},
		JS:             []string{"/assets/js/universal.js", "/assets/js/langHandler.js"},
		Data:           au,
		TargetStrings:  returnTargetStrings(),
		DefaultStrings: returnDefaultStrings(),
		TargetLanguage: model.ServSettingGetLang(),
	}

	templateArray := []string{
		returnDynamicTemplate("settings.gohtml"),
		returnDynamicSubTemplate("heading.gohtml"),
		returnDynamicSubTemplate("footer.gohtml"),
		returnDynamicSubTemplate("head.gohtml"),
		returnDynamicSubTemplate("noscript.gohtml"),
	}

	tmpl["settings.html"] = template.Must(template.ParseFiles(templateArray...))

	templateError := tmpl["settings.html"].Execute(w, data)
	errorHandler.StandardError(templateError)
}

// UploadPageHandler is a very simple HTTP Serving File for the Upload Page
func UploadPageHandler(w http.ResponseWriter, r *http.Request) {

	data := model.PageTemplate{
		Title:          "GoPage - Upload",
		Theme:          "/assets/css/theme-dark.css",
		CSS:            []string{"/assets/css/dist/universal.min.css", "/assets/css/dist/uploadImage.min.css"},
		JS:             []string{"/assets/js/langHandler.js", "/assets/js/universal.js", "/assets/js/universe.js", "/assets/js/uploadImage.js"},
		Data:           "",
		TargetStrings:  returnTargetStrings(),
		DefaultStrings: returnDefaultStrings(),
		TargetLanguage: model.ServSettingGetLang(),
	}

	templateArray := []string{
		returnDynamicTemplate("uploadImage.gohtml"),
		returnDynamicSubTemplate("heading.gohtml"),
		returnDynamicSubTemplate("footer.gohtml"),
		returnDynamicSubTemplate("head.gohtml"),
		returnDynamicSubTemplate("noscript.gohtml"),
		returnDynamicSubTemplate("snackbar.gohtml"),
		returnDynamicSubTemplate("modal.gohtml"),
		returnDynamicSubTemplate("returnsGlobalJS.gohtml"),
	}

	tmpl["uploadPage.html"] = template.Must(template.ParseFiles(templateArray...))
	templateError := tmpl["uploadPage.html"].Execute(w, data)
	errorHandler.StandardError(templateError)
}

// PluginRepoPageHandler returns Template: pluginRepo.html w/ Data: apiFunc.GetPluginData
func PluginRepoPageHandler(w http.ResponseWriter, r *http.Request) {

	data := model.PageTemplate{
		Title:          "Gopage - Plugin Repo",
		Theme:          "/assets/css/theme-dark.css",
		CSS:            []string{"/assets/css/dist/universal.min.css", "/assets/css/dist/pluginRepo.min.css"},
		JS:             []string{"/assets/js/pluginRepo.js", "/assets/js/universe.js", "/assets/js/langHandler.js", "/assets/js/universal.js"},
		Data:           apiFunc.GetDualPluginList(),
		TargetStrings:  returnTargetStrings(),
		DefaultStrings: returnDefaultStrings(),
		TargetLanguage: model.ServSettingGetLang(),
	}

	templateArray := []string{
		returnDynamicTemplate("pluginRepo.gohtml"),
		returnDynamicSubTemplate("heading.gohtml"),
		returnDynamicSubTemplate("footer.gohtml"),
		returnDynamicSubTemplate("noscript.gohtml"),
		returnDynamicSubTemplate("head.gohtml"),
		returnDynamicSubTemplate("snackbar.gohtml"),
		returnDynamicSubTemplate("modal.gohtml"),
		returnDynamicSubTemplate("returnsGlobalJS.gohtml"),
		returnDynamicSubTemplate("pluginRepo/pluginItem.gohtml"),
	}

	// This func map allows any item regaurdless of context to access the strings, specifically for
	// variable declaration within subtemplates that are passed a ranged context
	thisTemplate := template.Must(template.New("pluginRepo.gohtml").Funcs(template.FuncMap{
		"ReturnTargetStrings": func() map[string]string {
			return data.TargetStrings
		},
		"ReturnDefaultStrings": func() map[string]string {
			return data.DefaultStrings
		},
	}).ParseFiles(templateArray...))

	templateError := thisTemplate.Execute(w, data)
	errorHandler.StandardError(templateError)
}

// LinkHealthPageHandler returns basic page data w/ no template. Page: linkhealth.html
func LinkHealthPageHandler(w http.ResponseWriter, r *http.Request) {

	data := model.PageTemplate{
		Title:          "GoPage - Link Health",
		Theme:          "/assets/css/theme-dark.css",
		CSS:            []string{"/assets/css/dist/universal.min.css"},
		JS:             []string{"/assets/js/universal.js", "/assets/js/langHandler.js", "/assets/js/linkhealth.js"},
		Data:           "",
		TargetStrings:  returnTargetStrings(),
		DefaultStrings: returnDefaultStrings(),
		TargetLanguage: model.ServSettingGetLang(),
	}

	templateArray := []string{
		returnDynamicTemplate("linkhealth.gohtml"),
		returnDynamicSubTemplate("heading.gohtml"),
		returnDynamicSubTemplate("footer.gohtml"),
		returnDynamicSubTemplate("head.gohtml"),
		returnDynamicSubTemplate("noscript.gohtml"),
	}

	tmpl["linkhealth.html"] = template.Must(template.ParseFiles(templateArray...))
	templateError := tmpl["linkhealth.html"].Execute(w, data)
	errorHandler.StandardError(templateError)
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
	fmt.Printf("Uploaded File: %+v\n", universalMethods.LogInjectionAvoidance(handler.Filename))
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

// RobotsHandler is a simple static file server for a robots file, if this happens to exposed to the internet
func RobotsHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("directories.staticAssets")+"static/robots.txt")
}

// SitemapHandler is a simple static file server for the sitemap at the root
func SitemapHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("directories.staticAssets")+"static/sitemap.xml")
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

// APIUserSettingGet is an API Endpoint utilizing the UserSettingGet of the model class to return the users settings as json
func APIUserSettingGet(w http.ResponseWriter, r *http.Request) {
	au := model.UserSettingGet()
	json.NewEncoder(w).Encode(au)
}

// UserImagesHandler returns a list of file names as json from the user Images folder
func UserImagesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := ioutil.ReadDir(viper.GetString("directories.staticAssets") + "userImages/")
	errorHandler.JSONLoadError(w, err)
	var itemList string
	for _, file := range files {
		if file.Name() != ".gitignore" {
			itemList = itemList + file.Name() + ","
		}
	}
	json.NewEncoder(w).Encode(itemList)
}

// ---------------- Server Settings Modifiers

// APIServerSettingsGet is an API Endpoint Utilizing ServSettingGet from the model package to return server settings as json
func APIServerSettingsGet(w http.ResponseWriter, r *http.Request) {
	au := model.ServSettingGet()
	json.NewEncoder(w).Encode(au)
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
	json.NewEncoder(w).Encode(html.EscapeString(resp))
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

// EditLinkItem is an API Handler for modifying Link Items with V2 models
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
	var alItms model.AllItemsV2
	err = json.Unmarshal(b, &alItms.Items)
	if err != nil {
		fmt.Println(err)
	}

	for u, itm := range alItms.Items {
		if itm.ID == i {
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

// DeleteHandler is an old carry-over to delete Items, this page could still work
func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: This is using the old struct for items and needs to be updated
	id := r.URL.Path[len("/delete/"):]
	i, err := strconv.Atoi(id)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	// Open File with Items
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR|os.O_APPEND, 0666)
	errorHandler.StandardError(err)
	defer file.Close()

	// Read File and Unmarshall JSON to []Items
	b, err := ioutil.ReadAll(file)
	errorHandler.StandardError(err)
	var alItms model.AllItemsV2
	err = json.Unmarshal(b, &alItms.Items)
	errorHandler.StandardError(err)

	for u, itm := range alItms.Items {
		if itm.ID == i {
			alItms.Items = append(alItms.Items[:u], alItms.Items[u+1:]...)
		}
	}

	newItemBytes, err := json.MarshalIndent(&alItms.Items, "", " ")
	errorHandler.StandardError(err)
	ioutil.WriteFile(viper.GetString("directories.data"), newItemBytes, 0666)
	http.Redirect(w, r, "/", 301)
}

// APIItemsHandler is an API Endpoint to return installed items.
func APIItemsHandler(w http.ResponseWriter, r *http.Request) {
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
	errorHandler.StandardError(err)
	defer file.Close()

	b, err := ioutil.ReadAll(file)
	errorHandler.StandardError(err)
	var alItms model.AllItemsV2
	err = json.Unmarshal(b, &alItms.Items)
	errorHandler.StandardError(err)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(alItms.Items)
}

// ------------ Plugin Item Handlers

// APIUpdatePlugin is an endpoint that updates the available plugins and returns json of the logs
func APIUpdatePlugin(w http.ResponseWriter, r *http.Request) {
	resp, err := apiFunc.UniversalAvailableUpdate()
	errorHandler.JSONReturnError(w, err)
	fmt.Println("From Update Plugin:", resp)
	json.NewEncoder(w).Encode(resp)
}

// APIInstallPlugin an endpoint to install a specific plugin via URL Parameters, returning json of logs
func APIInstallPlugin(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["source"]
	if !ok || len(keys[0]) < 1 {
		fmt.Println("URL Param 'source' is missing")
		return
	}
	source := keys[0]

	resp, err := apiFunc.InstallUniversal(source)
	errorHandler.JSONReturnError(w, err)
	fmt.Println("From Install Plugin:", universalMethods.LogInjectionAvoidance(resp))
	json.NewEncoder(w).Encode(html.EscapeString(resp))
}

// APIUninstallPlugin an endpoint to uninstall a specific plugin via URL Parameters, return json of logs
func APIUninstallPlugin(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["pluginName"]
	if !ok || len(keys[0]) < 1 {
		fmt.Println("URL Param 'pluginName' is missing")
		return
	}
	pluginName := keys[0]

	resp, err := apiFunc.UninstallUniversal(pluginName)
	errorHandler.JSONReturnError(w, err)
	fmt.Println("From Uninstall Plugin:", universalMethods.LogInjectionAvoidance(resp))
	json.NewEncoder(w).Encode(html.EscapeString(resp))
}

// ------------ API Handlers

// APIPingHandler is the API Endpoint for the Ping function for plugins
func APIPingHandler(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["url"]
	if !ok || len(keys[0]) < 1 {
		fmt.Println("Url Param 'url' is missing")
		return
	}
	url := keys[0]
	resp, err := apiFunc.Ping(url)
	//errorHandler.JSONReturnError(w, err)
	// Error checking added here to ensure an int is always returned on this endpoint, but logging of error still occurs.
	if err != nil {
		fmt.Println(err)
	}
	json.NewEncoder(w).Encode(resp)
}

// APIPingNoSSLHandler is the API Endpoint for the No SSL Ping function for plugins
func APIPingNoSSLHandler(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["url"]
	if !ok || len(keys[0]) < 1 {
		fmt.Println("URL Param 'url' is missing")
		return
	}
	url := keys[0]
	resp, err := apiFunc.PingNoSSL(url)
	//errorHandler.JSONReturnError(w, err)
	if err != nil {
		fmt.Println(err)
	}
	json.NewEncoder(w).Encode(resp)
}

// APIHostNameHandler exposes the HostName API Endpoint
func APIHostNameHandler(w http.ResponseWriter, r *http.Request) {
	resp, err := apiFunc.HostSettingGet()
	errorHandler.PageLoadError(w, err)
	json.NewEncoder(w).Encode(resp)
}

// APIHostOSHandler exposes the HostOS Api Endpoint
func APIHostOSHandler(w http.ResponseWriter, r *http.Request) {
	resp := apiFunc.HostOSGet()
	json.NewEncoder(w).Encode(resp)
}

// APIInstalledPluginsHandler exposes the installed plugins endpoint
func APIInstalledPluginsHandler(w http.ResponseWriter, r *http.Request) {
	resp := "NO LONGER IMPLEMENTED"
	json.NewEncoder(w).Encode(resp)
}
