package main

import (
	"compress/gzip"
	"fmt"
	config "github.com/confused-Techie/GoPage/src/pkg/config"
	handler "github.com/confused-Techie/GoPage/src/pkg/handler"
	model "github.com/confused-Techie/GoPage/src/pkg/model"
	modifySettings "github.com/confused-Techie/GoPage/src/pkg/modifySettings"
	searchfeatures "github.com/confused-Techie/GoPage/src/pkg/searchfeatures"
	universalMethods "github.com/confused-Techie/GoPage/src/pkg/universalMethods"
	httpsnoop "github.com/felixge/httpsnoop"
	"github.com/spf13/viper"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"sync"
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

func requestGetRemoteAddress(r *http.Request) string {
	hdr := r.Header
	hdrRealIP := hdr.Get("X-Real-Ip")
	hdrForwardedFor := hdr.Get("X-Forwarded-For")
	if hdrRealIP == "" && hdrForwardedFor == "" {
		return r.RemoteAddr
	}
	if hdrForwardedFor != "" {
		// X-Forwarded-For is potentially a list of addresses seperated with ","
		parts := strings.Split(hdrForwardedFor, ",")
		for i, p := range parts {
			parts[i] = strings.TrimSpace(p)
		}
		// TODO: should return first non-local address
		return parts[0]
	}
	return hdrRealIP
}

func cacheControl(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		modtime := universalMethods.LastModifiedTime(r.URL.String())

		w.Header().Set("Cache-Control", "max-age=2592000") // 30 Days
		w.Header().Set("Last-Modified", modtime)

		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func customgzipHandler(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		// check if the client can accept gzip compressed content
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			// cannot accept
			return
		}
		// can accept
		// set HTTP header indicated encoding
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		h.ServeHTTP(&gzipResponseWriter{Writer: gz, ResponseWriter: w}, r)
		//return gzipResponseWriter{Writer: gz, ResponseWriter: w}
	}
	return http.HandlerFunc(fn)
}

var gzPool = sync.Pool{
	New: func() interface{} {
		w := gzip.NewWriter(ioutil.Discard)
		gzip.NewWriterLevel(w, gzip.BestCompression)
		//gzip.NewWriterLevel(w, gzip.BestSpeed)
		return w
	},
}

func (w *gzipResponseWriter) WriteHeader(status int) {
	w.Header().Del("Content-Length")
	w.ResponseWriter.WriteHeader(status)
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func gzipHandler(h http.Handler) http.Handler {
	//https://stackoverflow.com/a/64433192/12707685
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// check if the client can accept gzip compressed content
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			// cannot accept, return serving
			h.ServeHTTP(w, r)
			return
		}
		// can accept, set http headers
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzPool.Get().(*gzip.Writer)
		defer gzPool.Put(gz)

		gz.Reset(w)
		defer gz.Close()

		h.ServeHTTP(&gzipResponseWriter{ResponseWriter: w, Writer: gz}, r)
	})
}

func logRequestHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//h.ServeHTTP(w, r)
		ri := &model.HTTPReqInfo{
			Method:    r.Method,
			Uri:       r.URL.String(),
			Referer:   r.Header.Get("Referer"),
			UserAgent: r.Header.Get("User-Agent"),
			Protocol:  r.Proto,
			Ipaddr:    requestGetRemoteAddress(r),
		}
		// httpsnoop runs its own handler, so h.ServeHTTP(w, r) is no longer needed
		snoop := httpsnoop.CaptureMetrics(h, w, r)
		ri.Code = snoop.Code
		ri.Size = snoop.Written
		ri.Duration = snoop.Duration

		logMethod := model.ServSettingGetLogging()

		const (
			NCSACommonFormat = "02/Jan/2006:15:04:05 -0700"
		)
		date := time.Now()

		if logMethod == "combined" {
			fmt.Printf("%s  - - [%s] '%s %s %s' %d %d '%s' '%s'\n", ri.Ipaddr, date.Format(NCSACommonFormat), ri.Method, ri.Uri, ri.Protocol, ri.Code, ri.Size, ri.Referer, ri.UserAgent)
		}
		if logMethod == "common" {
			fmt.Printf("%s - - [%s] '%s %s %s' %d %d\n", ri.Ipaddr, date.Format(NCSACommonFormat), ri.Method, ri.Uri, ri.Protocol, ri.Code, ri.Size)
		}
		if logMethod == "custom" {
			log.Printf("'%s %s' from %s - %d %dB in %v\n", ri.Method, ri.Uri, ri.Ipaddr, ri.Code, ri.Size, ri.Duration)
		}
	})

}

func notFoundHandler(h http.Handler) http.Handler {
	// Since the HomePage of GoPage is registered to '/' any non-existant path is still registered to the root, and will be redirected there,
	// so to properly have a page return 404, it's needed to implement a custom 404 middleware to the HomePage,
	// otherwise currently you could type anything after '/' and if its not another valid path it redirects to the homepage
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			w.WriteHeader(http.StatusNotFound)
			handler.NotFoundHandler(w, r)
			return
		}
		h.ServeHTTP(w, r)
	})
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
	fmt.Println(universalMethods.LogInjectionAvoidance(langEnv))

	logEnv, err := modifySettings.DetermineLogging()
	if err != nil {
		log.Fatal("Cannot Determine")
	}
	fmt.Println(universalMethods.LogInjectionAvoidance(logEnv))

	// this is used to cause a startup check for the robots method
	robotsEnv, err := modifySettings.DetermineRobots()
	if err != nil {
		log.Fatal("Cannot Determine Robots Setting: ", err)
	}
	fmt.Println(universalMethods.LogInjectionAvoidance(robotsEnv))

	// Reading variables using the model. This is for dev purposes
	fmt.Println("Server Port: \t", config.Server.Port)

	// Start the search Index
	searchfeatures.BuildIndex()

	// Basic Page Handles: For the standard user pages

	mux := http.NewServeMux()

	// Standard Page Endpoints
	mux.Handle("/", logRequestHandler(notFoundHandler(http.HandlerFunc(handler.HomePageHandler))))
	mux.Handle("/settings", logRequestHandler(http.HandlerFunc(handler.SettingsPageHandler)))
	mux.Handle("/pluginrepo", logRequestHandler(http.HandlerFunc(handler.PluginRepoPageHandler)))
	mux.Handle("/linkhealth", logRequestHandler(http.HandlerFunc(handler.LinkHealthPageHandler)))
	mux.Handle("/uploadpage", logRequestHandler(http.HandlerFunc(handler.UploadPageHandler)))

	// Components Endpoints
	mux.Handle("/robots.txt", http.HandlerFunc(handler.RobotsHandler))
	mux.Handle("/sitemap.xml", http.HandlerFunc(handler.SitemapHandler))

	// UploadPage Endpoints: Used for the functionality of the uploadPage
	mux.Handle("/upload", http.HandlerFunc(handler.UploadHandler))
	mux.Handle("/userimages", http.HandlerFunc(handler.UserImagesHandler))

	// Plugin Repo Endpoints: Used for the functionality of the PluginRepo
	mux.Handle("/plugins/install", http.HandlerFunc(handler.APIInstallPlugin))
	mux.Handle("/plugins/uninstall", http.HandlerFunc(handler.APIUninstallPlugin))
	mux.Handle("/plugins/update", http.HandlerFunc(handler.APIUpdatePlugin))

	// Modify Link Item Pages

	// Carryover from previous format. URL Query based page to delete link, still usable
	mux.Handle("/delete/", http.HandlerFunc(handler.DeleteHandler))

	// API Endpoints for Modifying Link Items via JSON
	mux.Handle("/api/deletelink/", http.HandlerFunc(handler.DeleteLinkItem))
	mux.Handle("/api/edit/", http.HandlerFunc(handler.EditLinkItem))
	mux.Handle("/api/new/", http.HandlerFunc(handler.AddLinkItem))

	// Static Directories Access

	// CSS / JS / Language / Images Endpoints
	fs := gzipHandler(http.FileServer(http.Dir(viper.GetString("directories.staticAssets"))))
	mux.Handle("/assets/", cacheControl(logRequestHandler(http.StripPrefix("/assets/", fs))))

	// Plugins Folder: Installed/Available/Installed Plugins Data

	plugin := http.FileServer(http.Dir(viper.GetString("directories.plugin")))
	mux.Handle("/plugins/", noCache(http.StripPrefix("/plugins/", plugin)))

	// API Endpoints

	mux.Handle("/api/items", http.HandlerFunc(handler.APIItemsHandler))
	mux.Handle("/api/serversettings", http.HandlerFunc(handler.APIServerSettingsGet))
	mux.Handle("/api/changelang", http.HandlerFunc(handler.ChangeLang)) // /api/changelang?lang=en
	mux.Handle("/api/change", http.HandlerFunc(handler.ChangeMany))     // Used to change many different settings
	// ^^ /api/change?id=logging&value=custom /api/change?id=robots&value=private
	mux.Handle("/api/usersettings", http.HandlerFunc(handler.APIUserSettingGet))
	mux.Handle("/api/usersettingswrite", http.HandlerFunc(handler.UserSettingSet))
	mux.Handle("/api/search", http.HandlerFunc(handler.Search))

	// API Declarations used for plugins
	mux.Handle("/api/ping", http.HandlerFunc(handler.APIPingHandler))
	mux.Handle("/api/ping/nossl", http.HandlerFunc(handler.APIPingNoSSLHandler))
	mux.Handle("/api/hostname", http.HandlerFunc(handler.APIHostNameHandler))
	mux.Handle("/api/hostos", http.HandlerFunc(handler.APIHostOSHandler))
	mux.Handle("/api/getinstalledplugins", http.HandlerFunc(handler.APIInstalledPluginsHandler))

	// We are wrapping the listen in log.Fatal since it will only ever return an error, but otherwise nil
	//log.Fatal(http.ListenAndServe(":"+viper.GetString("server.port"), nil))
	log.Fatal(http.ListenAndServe(":"+viper.GetString("server.port"), mux))
}
