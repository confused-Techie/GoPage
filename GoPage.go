package main

import (
	"encoding/json"
	"fmt"
	apiFunc "github.com/confused-Techie/GoPage/apiFunc"
	config "github.com/confused-Techie/GoPage/config"
	handler "github.com/confused-Techie/GoPage/handler"
	model "github.com/confused-Techie/GoPage/model"
	modifySettings "github.com/confused-Techie/GoPage/modifySettings"
	"github.com/spf13/viper"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

func checkError(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

func checkFormValue(w http.ResponseWriter, r *http.Request, forms ...string) (res bool, errStr string) {
	for _, form := range forms {
		if r.FormValue(form) == "" {
			return false, "All Forms must be completed!"
		}
	}
	return true, ""
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	au := model.Home()
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/homePage.html")
	checkError(err)
	t.Execute(w, au)
}

func linkHealthHandler(w http.ResponseWriter, r *http.Request) {
	p := viper.GetString("directories.templates") + "/linkhealth.html"
	http.ServeFile(w, r, p)
}

func uploadPageHandler(w http.ResponseWriter, r *http.Request) {
	p := viper.GetString("directories.templates") + "/uploadImage.html"
	http.ServeFile(w, r, p)
}

func settingsHandler(w http.ResponseWriter, r *http.Request) {
	au := model.ServSettingGet()
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/settings.html")
	checkError(err)
	t.Execute(w, au)
}

func pluginRepoHandler(w http.ResponseWriter, r *http.Request) {
	//resp := apiFunc.GetInstalledPluginsList()
	resp := apiFunc.GetPluginData()
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/pluginRepo.html")
	checkError(err)
	t.Execute(w, resp)
}

func updateHandler(w http.ResponseWriter, r *http.Request) {
	updateItem := &model.Item{}

	resBool, errStr := checkFormValue(w, r, "friendlyName", "link", "category")
	if resBool == false {
		t, err := template.ParseFiles(viper.GetString("directories.templates") + "/error.html")
		checkError(err)
		t.Execute(w, errStr)
		return
	}

	updateItem.FriendlyName = r.FormValue("friendlyName")
	updateItem.Link = r.FormValue("link")
	updateItem.Category = r.FormValue("category")
	updateItem.LeftPlugin = r.FormValue("leftPlugin")
	updateItem.LeftPluginOptions = r.FormValue("leftPluginOptions")
	updateItem.CenterPlugin = r.FormValue("centerPlugin")
	updateItem.CenterPluginOptions = r.FormValue("centerPluginOptions")
	updateItem.RightPlugin = r.FormValue("rightPlugin")
	updateItem.RightPluginOptions = r.FormValue("rightPluginOptions")

	a, errr := strconv.Atoi(r.FormValue("id"))
	checkError(errr)
	updateItem.Id = a
	var err error

	// open file
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
	checkError(err)
	defer file.Close()

	b, err := ioutil.ReadAll(file)
	checkError(err)
	var allItms model.AllItems
	err = json.Unmarshal(b, &allItms.Items)
	checkError(err)

	for i, itm := range allItms.Items {
		if itm.Id == updateItem.Id {
			allItms.Items[i].FriendlyName = updateItem.FriendlyName
			allItms.Items[i].Link = updateItem.Link
			allItms.Items[i].Category = updateItem.Category
			allItms.Items[i].LeftPlugin = updateItem.LeftPlugin
			allItms.Items[i].LeftPluginOptions = updateItem.LeftPluginOptions
			allItms.Items[i].CenterPlugin = updateItem.CenterPlugin
			allItms.Items[i].CenterPluginOptions = updateItem.CenterPluginOptions
			allItms.Items[i].RightPlugin = updateItem.RightPlugin
			allItms.Items[i].RightPluginOptions = updateItem.RightPluginOptions
		}
	}

	newItemBytes, err := json.MarshalIndent(&allItms.Items, "", " ")
	checkError(err)
	ioutil.WriteFile(viper.GetString("directories.data"), newItemBytes, 0666)
	http.Redirect(w, r, "/", 301)
}

func deleteHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/delete/"):]
	i, err := strconv.Atoi(id)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	// open file with items
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR|os.O_APPEND, 0666)
	checkError(err)
	defer file.Close()

	// read file and unmarshall json to []items
	b, err := ioutil.ReadAll(file)
	checkError(err)
	var alItms model.AllItems
	err = json.Unmarshal(b, &alItms.Items)
	checkError(err)

	for u, itm := range alItms.Items {
		if itm.Id == i {
			alItms.Items = append(alItms.Items[:u], alItms.Items[u+1:]...)
		}
	}

	newItemBytes, err := json.MarshalIndent(&alItms.Items, "", " ")
	checkError(err)
	ioutil.WriteFile(viper.GetString("directories.data"), newItemBytes, 0666)
	http.Redirect(w, r, "/", 301)
}

func editHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/edit/"):]
	i, err := strconv.Atoi(id)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	au := model.Singleton(i)
	t, err := template.ParseFiles(viper.GetString("directories.templates") + "/editPage.html")
	checkError(err)
	t.Execute(w, au)
}

func newHandler(w http.ResponseWriter, r *http.Request) {
	//creating new instance and checking method
	newItem := &model.Item{}
	if r.Method == "GET" {
		t, _ := template.ParseFiles(viper.GetString("directories.templates") + "/newItem.html")
		t.Execute(w, nil)
	} else {
		resBool, errStr := checkFormValue(w, r, "friendlyName", "link", "category")
		if resBool == false {
			t, err := template.ParseFiles(viper.GetString("directories.templates") + "/error.html")
			checkError(err)
			t.Execute(w, errStr)
			return
		}

		newItem.FriendlyName = r.FormValue("friendlyName")
		newItem.Link = r.FormValue("link")
		newItem.Category = r.FormValue("category")
		newItem.LeftPlugin = r.FormValue("leftPlugin")
		newItem.LeftPluginOptions = r.FormValue("leftPluginOptions")
		newItem.CenterPlugin = r.FormValue("centerPlugin")
		newItem.CenterPlugin = r.FormValue("centerPluginOptions")
		newItem.RightPlugin = r.FormValue("rightPlugin")
		newItem.RightPlugin = r.FormValue("rightPluginOptions")
		var err error
		//open file
		file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
		checkError(err)
		defer file.Close()

		//read file and unmarshall json file to slice of users
		b, err := ioutil.ReadAll(file)
		checkError(err)
		var alItms model.AllItems
		err = json.Unmarshal(b, &alItms.Items)
		checkError(err)
		max := 0

		// generation of id(last id at the json file+1)
		for _, itm := range alItms.Items {
			if itm.Id > max {
				max = itm.Id
			}
		}
		id := max + 1
		newItem.Id = id

		// appending newItem to slice of all Items and rewrite json file
		alItms.Items = append(alItms.Items, newItem)
		newItemBytes, err := json.MarshalIndent(&alItms.Items, "", " ")
		checkError(err)
		ioutil.WriteFile(viper.GetString("directories.data"), newItemBytes, 0666)
		http.Redirect(w, r, "/", 301)
	}
}

func apiItemsHandler(w http.ResponseWriter, r *http.Request) {
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
	checkError(err)
	defer file.Close()

	b, err := ioutil.ReadAll(file)
	checkError(err)
	var alItms model.AllItems
	err = json.Unmarshal(b, &alItms.Items)
	checkError(err)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(alItms.Items)
}

func apiPingHandler(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["url"]
	if !ok || len(keys[0]) < 1 {
		log.Println("Url Param 'url' is missing")
		return
	}
	url := keys[0]
	//url := r.URL.Path[len("/api/ping/"):]
	resp, err := apiFunc.Ping(url)
	checkError(err)
	json.NewEncoder(w).Encode(resp)
}

func apiServerSettingsHandler(w http.ResponseWriter, r *http.Request) {
	au := model.ServSettingGet()
	json.NewEncoder(w).Encode(au)
}

func apiUserSettingsHandler(w http.ResponseWriter, r *http.Request) {
	au := model.UserSettingGet()
	json.NewEncoder(w).Encode(au)
}

func apiHostNameHandler(w http.ResponseWriter, r *http.Request) {
	resp, err := apiFunc.HostSettingGet()
	checkError(err)
	json.NewEncoder(w).Encode(resp)
}
func apiHostOSHandler(w http.ResponseWriter, r *http.Request) {
	resp := apiFunc.HostOSGet()
	json.NewEncoder(w).Encode(resp)
}
func apiInstalledPluginsHandler(w http.ResponseWriter, r *http.Request) {
	resp := apiFunc.GetInstalledPluginsList()
	//fmt.Println(resp)
	json.NewEncoder(w).Encode(resp)

}

func apiInstallPlugin(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["source"]
	if !ok || len(keys[0]) < 1 {
		log.Println("URL Param 'source' is missing")
		return
	}
	source := keys[0]

	resp, err := apiFunc.InstallUniversal(source)
	if err != nil {
		fmt.Println("From GoPage.go: Error: ", err)
		json.NewEncoder(w).Encode(err)
	}
	fmt.Println("from goPage.go", resp)
	json.NewEncoder(w).Encode(resp)
}

func apiUninstallPlugin(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["pluginName"]
	if !ok || len(keys[0]) < 1 {
		log.Println("URL Param 'pluginName' is missing")
		return
	}
	pluginName := keys[0]

	resp, err := apiFunc.UninstallUniversal(pluginName)
	if err != nil {
		fmt.Println("From GoPage.go: Error: ", err)
		json.NewEncoder(w).Encode(err)
	}
	fmt.Println("from goPage.go", resp)
	json.NewEncoder(w).Encode(resp)
}

func apiUpdatePlugin(w http.ResponseWriter, r *http.Request) {
	resp, err := apiFunc.UniversalAvailableUpdate()
	if err != nil {
		fmt.Println("From GoPage.go: Error:", err)
		json.NewEncoder(w).Encode(err)
	}
	fmt.Println("From GoPage.go", resp)
	json.NewEncoder(w).Encode(resp)
}

func userImagesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := ioutil.ReadDir(viper.GetString("directories.staticAssets") + "userImages/")
	if err != nil {
		log.Fatal(err)
	}
	var itemList string
	for _, file := range files {
		if file.Name() != ".gitignore" {
			itemList = itemList + file.Name() + ","
		}

	}
	json.NewEncoder(w).Encode(itemList)
}

func main() {
	// Here we can add all viper configuration file/env file setup
	// this will grab the proper config location, home of windows or linux, or if dev flag used the local dir
	workEnv := config.DetermineEnv()

	fmt.Println("Reading Config: \t", workEnv)

	// this will then try to grab the config data
	config, err := config.LoadConfig(workEnv)
	// config from config.go is accidentally redeclared here.
	// TODO: Modify all further references to the config variable to a new variable here to config can be used to access the package
	if err != nil {
		log.Fatal("Cannot load Config: ", err)
	}

	// this is used to cause a startup check to the language specified
	langEnv, err := modifySettings.DetermineLang()
	if err != nil {
		log.Fatal("Cannot Determine Server Language: ", err)
	}
	fmt.Println(langEnv)

	// Reading variables using the model. This is for dev purposes
	fmt.Println("Server Port: \t", config.Server.Port)

	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/settings", settingsHandler)
	http.HandleFunc("/pluginrepo", pluginRepoHandler)
	http.HandleFunc("/linkhealth", linkHealthHandler)

	http.HandleFunc("/update/", updateHandler)
	http.HandleFunc("/delete/", deleteHandler)
	http.HandleFunc("/edit/", editHandler)
	http.HandleFunc("/new/", newHandler)

	http.HandleFunc("/upload", handler.UploadHandler)
	http.HandleFunc("/uploadpage", uploadPageHandler)
	http.HandleFunc("/userimages", userImagesHandler)

	// now to allow static file serving for css and js assets
	fs := http.FileServer(http.Dir(viper.GetString("directories.staticAssets")))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))

	// allow static file serving from the plugins folder
	plugin := http.FileServer(http.Dir(viper.GetString("directories.plugin")))
	http.Handle("/plugins/", http.StripPrefix("/plugins/", plugin))

	// Here cna be defiend any static pages needed.
	// Like the linkhealth page
	//linkHealth := http.FileServer(http.Dir(viper.GetString("directories.templates") + "/linkhealth.html"))
	//http.Handle("/linkhealth", http.StripPrefix(viper.GetString("directories.templates"), linkHealth))

	// For the proper filtering of items, and hopeful searching, here will be an api call for js to get all items as json
	http.HandleFunc("/api/items", apiItemsHandler)
	http.HandleFunc("/api/serversettings", apiServerSettingsHandler)
	http.HandleFunc("/api/changelang", handler.ChangeLang)	// /api/changelang?lang=en
	http.HandleFunc("/api/usersettings", apiUserSettingsHandler)
	http.HandleFunc("/api/usersettingswrite", model.UserSettingSet)
	// Below will be API declarations used for plugins
	http.HandleFunc("/api/ping", apiPingHandler)
	http.HandleFunc("/api/hostname", apiHostNameHandler)
	http.HandleFunc("/api/hostos", apiHostOSHandler)
	http.HandleFunc("/api/getinstalledplugins", apiInstalledPluginsHandler)

	http.HandleFunc("/plugins/install", apiInstallPlugin)

	http.HandleFunc("/plugins/uninstall", apiUninstallPlugin)

	http.HandleFunc("/plugins/update", apiUpdatePlugin)

	// We are wrapping the listen in log.Fatal since it will only ever return an error, but otherwise nil
	log.Fatal(http.ListenAndServe(":"+viper.GetString("server.port"), nil))
}
