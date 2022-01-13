package main

import (
	"fmt"
	config "github.com/confused-Techie/GoPage/config"
	handler "github.com/confused-Techie/GoPage/handler"
	modifySettings "github.com/confused-Techie/GoPage/modifySettings"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"time"
)

// Below no caching mechanism borrowed from elithrar stackoverflow
// Or more percisley their repo: zenazn/goji
var epoch = time.Unix(0, 0).Format(time.RFC1123)

var noCacheHeaders = map[string]string{
	"Expires":         epoch,
	"Cache-Control":   "no-cache, private, max-age=0",
	"Pragma":          "no-cache",
	"X-Accel-Expires": "0",
}

var etagHeaders = []string{
	"ETag",
	"If-Modified-Since",
	"If-Match",
	"If-None-Match",
	"If-Range",
	"If-Unmodified-Since",
}

func noCache(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		// Delete any ETag headers that may have been set
		for _, v := range etagHeaders {
			if r.Header.Get(v) != "" {
				r.Header.Del(v)
			}
		}

		// Set our NoCahce Headers
		for k, v := range noCacheHeaders {
			w.Header().Set(k, v)
		}

		h.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}

func main() {
	// Here we can add all viper configuration file/env file setup
	// this will grab the proper config location, home of windows or linux, or if dev flag used the local dir
	workEnv := config.DetermineEnv()

	fmt.Println("Reading Config: \t", workEnv)

	// this will then try to grab the config data
	config, err := config.LoadConfig(workEnv)
	// config from config.go is accidentally redeclared here.
	// TODO: Modify all further references to the config variable to a new variable here so config can be used to access the package
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

	// Basic Page Handles: For the standard user pages

	http.HandleFunc("/", handler.HomePageHandler)
	http.HandleFunc("/settings", handler.SettingsPageHandler)
	http.HandleFunc("/pluginrepo", handler.PluginRepoPageHandler)
	http.HandleFunc("/linkhealth", handler.LinkHealthPageHandler)
	http.HandleFunc("/uploadpage", handler.UploadPageHandler)

	// UploadPage Endpoints: Used for the functionality of the uploadPage
	http.HandleFunc("/upload", handler.UploadHandler)
	http.HandleFunc("/userimages", handler.UserImagesHandler)

	// Plugin Repo Endpoints: Used for the functionality of PluginRepo
	http.HandleFunc("/plugins/install", handler.APIInstallPlugin)
	http.HandleFunc("/plugins/uninstall", handler.APIUninstallPlugin)
	http.HandleFunc("/plugins/update", handler.APIUpdatePlugin)

	// Modify Link Item Pages

	// Carryover from previous format. URL Query based page to delete link, still usable
	http.HandleFunc("/delete/", handler.DeleteHandler)

	// API Endpoints for Modifying Link Items via JSON
	http.HandleFunc("/api/deletelink/", handler.DeleteLinkItem)
	http.HandleFunc("/api/edit/", handler.EditLinkItem)
	http.HandleFunc("/api/new/", handler.AddLinkItem)

	// Static Directories Access

	// CSS / JS / Language / Images
	fs := http.FileServer(http.Dir(viper.GetString("directories.staticAssets")))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))

	// Plugins Folder: Installed/Available/Installed Plugins Data
	plugin := http.FileServer(http.Dir(viper.GetString("directories.plugin")))
	http.Handle("/plugins/", noCache(http.StripPrefix("/plugins/", plugin)))

	// API Endpoints

	// For the proper filtering of items, and hopeful searching, here will be an api call for js to get all items as json
	http.HandleFunc("/api/items", handler.APIItemsHandler)
	http.HandleFunc("/api/serversettings", handler.APIServerSettingsGet)
	http.HandleFunc("/api/changelang", handler.ChangeLang) // /api/changelang?lang=en
	http.HandleFunc("/api/usersettings", handler.APIUserSettingGet)
	//http.HandleFunc("/api/usersettingswrite", model.UserSettingSet)
	http.HandleFunc("/api/usersettingswrite", handler.UserSettingSet)

	// Below will be API declarations used for plugins
	http.HandleFunc("/api/ping", handler.APIPingHandler)
	http.HandleFunc("/api/hostname", handler.APIHostNameHandler)
	http.HandleFunc("/api/hostos", handler.APIHostOSHandler)
	http.HandleFunc("/api/getinstalledplugins", handler.APIInstalledPluginsHandler)

	// We are wrapping the listen in log.Fatal since it will only ever return an error, but otherwise nil
	log.Fatal(http.ListenAndServe(":"+viper.GetString("server.port"), nil))
}
