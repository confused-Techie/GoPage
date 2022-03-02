package model

import (
	"encoding/json"
	"fmt"
	apiFunc "github.com/confused-Techie/GoPage/src/pkg/apiFunc"
	diskhandles "github.com/confused-Techie/GoPage/src/pkg/diskhandles"
	universalMethods "github.com/confused-Techie/GoPage/src/pkg/universalMethods"
	"github.com/spf13/viper"
	"io/ioutil"
	"os"
	"time"
)

// ItemPluginsV2 a struct dependency of ItemV2, for JSON Plugin Models
type ItemPluginsV2 struct {
	Name     string `json:"name"`
	Options  string `json:"options"`
	Location string `json:"location"`
}

// ItemV2 a struct dependency of AllItemsV2 for JSON Item Models
type ItemV2 struct {
	ID           int              `json:"id"`
	FriendlyName string           `json:"friendlyName"`
	Link         string           `json:"link"`
	Category     string           `json:"category"`
	Colour       string           `json:"colour"`
	Style        string           `json:"style"`
	Plugins      []*ItemPluginsV2 `json:"plugins"`
}

// AllItemsV2 a root struct of the array of JSON Item Models
type AllItemsV2 struct {
	Items []*ItemV2
}

// NoTopLeftPlugin a Method of the ItemV2 Struct to return a boolean if a plugin occupies the Top Left Space
func (i ItemV2) NoTopLeftPlugin() bool {
	doesHave := true
	for _, plg := range i.Plugins {
		if plg.Location == "top-left" {
			doesHave = false
		}
	}
	return doesHave
}

// NoTopRightPlugin a Method of the ItemV2 Struct to return a Boolean if a plugin occupies the Top Right Space
func (i ItemV2) NoTopRightPlugin() bool {
	doesHave := true
	for _, plg := range i.Plugins {
		if plg.Location == "top-right" {
			doesHave = false
		}
	}
	return doesHave
}

// NoCenterPlugin a Method of the ItemV2 Struct to return a boolean if a plugin occupies the center space
func (i ItemV2) NoCenterPlugin() bool {
	doesHave := true
	for _, plg := range i.Plugins {
		if plg.Location == "center" {
			doesHave = false
		}
	}
	return doesHave
}

// NoBottomLeftPlugin a Method of the ItemV2 Struct to return a boolean if a plugin occupies the Bottom Left Space
func (i ItemV2) NoBottomLeftPlugin() bool {
	doesHave := true
	for _, plg := range i.Plugins {
		if plg.Location == "bottom-left" {
			doesHave = false
		}
	}
	return doesHave
}

// NoBottomRightPlugin a Method of the ItemV2 Struct to return a boolean if a plugin occupies the Bottom Right Space
func (i ItemV2) NoBottomRightPlugin() bool {
	doesHave := true
	for _, plg := range i.Plugins {
		if plg.Location == "bottom-right" {
			doesHave = false
		}
	}
	return doesHave
}

// PageTemplate is used to define the struct used to create each page
type PageTemplate struct {
	Title            string
	Theme            string
	CSS              []string
	JS               []string
	Data             interface{}
	TargetStrings    map[string]string
	DefaultStrings   map[string]string
	TargetLanguage   string
	HomePageCategory []string
}

func checkError(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

// HomeV2 will return all Data Items to allow templating on GoPage HomePage
func HomeV2() (au *AllItemsV2) {
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR|os.O_APPEND, 0666)
	checkError(err)
	b, err := ioutil.ReadAll(file)
	var alItms AllItemsV2
	json.Unmarshal(b, &alItms.Items)
	checkError(err)
	return &alItms
}

// ReturnCategories needs an initialized AllItmsV2 struct to return a slice of strings of all unique categories
func ReturnCategories(au *AllItemsV2) []string {
	var allCtgry []string

	for _, itm := range au.Items {
		if !universalMethods.StringInSlice(itm.Category, allCtgry) {
			allCtgry = append(allCtgry, itm.Category)
		}
	}

	return allCtgry
}

// Below will be model data for settings and pluginRepo

// ServSetting is a struct to contain the Server Settings or serverSettings.json data
type ServSetting struct {
	Name     string `json:"name"`
	Version  string `json:"version"`
	Author   string `json:"author"`
	Language string `json:"lang"`
	Logging  string `json:"logging"`
	Robots   string `json:"robots"`
}

// FullServSetting a struct to contain the standard ServSetting AND the hostname and OS
type FullServSetting struct {
	ServerSettings *ServSetting
	ServerHostName string
	ServerOS       string
}

// FullServSettingGet a wrapper for the struct FullServSetting
func FullServSettingGet() (au *FullServSetting) {
	var fSrvStting FullServSetting
	fSrvStting.ServerSettings = ServSettingGet()

	tmp, err := apiFunc.HostSettingGet()
	checkError(err)
	fSrvStting.ServerHostName = tmp
	fSrvStting.ServerOS = apiFunc.HostOSGet()

	return &fSrvStting
}

// ServSettingGet returns the item of Server Settings to allow templating
func ServSettingGet() (au *ServSetting) {
	b, err := diskhandles.ReadFromDiskToBytes(viper.GetString("directories.setting") + "/serverSettings.json")
	checkError(err)
	var srvStting ServSetting
	json.Unmarshal(b, &srvStting)
	return &srvStting
}

// ServSettingGetLang returns a string of the langauge code saved in the server settings file
func ServSettingGetLang() string {
	srvStting := ServSettingGet()

	return srvStting.Language
}

// ServSettingGetRobots returns the string of whichh method of robots file to use.
func ServSettingGetRobots() string {
	srvStting := ServSettingGet()
	return srvStting.Robots
}

// ServSettingGetLogging allows a simple interface that returns a string of the logging format specified.
func ServSettingGetLogging() string {
	srvStting := ServSettingGet()
	return srvStting.Logging
}

// ServSettingSetLang is made to modify the server settings language value only
func ServSettingSetLang(newLang string) (string, error) {

	origBytes, err := diskhandles.ReadFromDiskToBytes(viper.GetString("directories.setting") + "/serverSettings.json")
	var origSrvStting ServSetting
	json.Unmarshal(origBytes, &origSrvStting)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// Then with the original file unpacked, we can modify the language variable and write it back to its file
	if origSrvStting.Language != newLang {
		origSrvStting.Language = newLang
	} else {
		return "No Change Needed to Server Language from: " + newLang, nil
	}

	_, err = diskhandles.WriteToDiskFromUnmarshal(&origSrvStting, viper.GetString("directories.setting")+"/serverSettings.json")
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	return "Successfully Changed Server Language to: " + newLang, nil
}

// ServSettingSetRobots can take a new robots value and save it to the serverSettings.json fiile.
func ServSettingSetRobots(newRobots string) (string, error) {
	origBytes, err := diskhandles.ReadFromDiskToBytes(viper.GetString("directories.setting") + "/serverSettings.json")
	var origSrvStting ServSetting
	json.Unmarshal(origBytes, &origSrvStting)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	if origSrvStting.Robots != newRobots {
		origSrvStting.Robots = newRobots
	} else {
		return "No Change Needed to Robots Setting from: " + newRobots, nil
	}

	_, err = diskhandles.WriteToDiskFromUnmarshal(&origSrvStting, viper.GetString("directories.setting")+"/serverSettings.json")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	return "Successfully Changed Server Robots Settings to: " + newRobots, nil
}

// ServSettingSetLogging takes a string of the new logging format and write it to the file, returning a string message of the action or error
func ServSettingSetLogging(newLogging string) (string, error) {
	origFile, err := os.OpenFile(viper.GetString("directories.setting")+"/serverSettings.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	origBytes, err := ioutil.ReadAll(origFile)
	var origSrvStting ServSetting
	json.Unmarshal(origBytes, &origSrvStting)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// then with the original file unpacked, we can modify the logging variable and write it back to its fiel
	if origSrvStting.Logging != newLogging {
		origSrvStting.Logging = newLogging
	} else {
		return "No Change Needed to Server Logging from: " + newLogging, nil
	}

	newSrvStting, err := json.MarshalIndent(&origSrvStting, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	ioutil.WriteFile(viper.GetString("directories.setting")+"/serverSettings.json", newSrvStting, 0666)
	return "Successfully Changed Server Logging to: " + newLogging, nil
}

// UserSetting struct is made to contain the JSON of User settings
type UserSetting struct {
	CustomBackground usrStgBck    `json:"customBackground"`
	HeaderPlugins    usrStgHdrPlg `json:"headerPlugins"`
}

type usrStgBck struct {
	Set    bool   `json:"set"`
	Src    string `json:"src"`
	Repeat string `json:"repeat"`
	Size   string `json:"size"`
}

type usrStgHdrPlg struct {
	Right usrStgHdrPlgInner `json:"right"`
	Left  usrStgHdrPlgInner `json:"left"`
}

type usrStgHdrPlgInner struct {
	Name    string `json:"name"`
	Options string `json:"options"`
}

// UserSettingGet is to access and return the user settings json
func UserSettingGet() (au *UserSetting) {
	file, err := os.OpenFile(viper.GetString("directories.setting")+"/userSettings.json", os.O_RDWR|os.O_APPEND, 0666)
	checkError(err)
	b, err := ioutil.ReadAll(file)
	var usrStting UserSetting
	json.Unmarshal(b, &usrStting)
	checkError(err)
	return &usrStting
}

// HTTPReqInfo is used for the HTTP logging middleware as a simple struct to pack its logged info into for easy access
type HTTPReqInfo struct {
	Method    string
	Uri       string
	Referer   string
	Ipaddr    string
	Code      int
	Size      int64
	Duration  time.Duration
	UserAgent string
	Protocol  string
}
