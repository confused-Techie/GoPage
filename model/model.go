package model

import (
	"encoding/json"
	"fmt"
	"github.com/spf13/viper"
	"io/ioutil"
	"net/http"
	"os"
)

// Item is struct for an individual Data Item
type Item struct {
	Id                  int    `json:"id"`
	FriendlyName        string `json:"friendlyName"`
	Link                string `json:"link"`
	Category            string `json:"category"`
	LeftPlugin          string `json:"left-plugin"`
	LeftPluginOptions   string `json:"left-plugin-options"`
	CenterPlugin        string `json:"center-plugin"`
	CenterPluginOptions string `json:"center-plugin-options"`
	RightPlugin         string `json:"right-plugin"`
	RightPluginOptions  string `json:"right-plugin-options"`
}

// AllItems is a struct for a slice/array of Data Items
type AllItems struct {
	Items []*Item
}

func checkError(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

// Home will return all Data Items to allow templating on GoPage HomePage
func Home() (au *AllItems) {
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR|os.O_APPEND, 0666)
	checkError(err)
	b, err := ioutil.ReadAll(file)
	var alItms AllItems
	json.Unmarshal(b, &alItms.Items)
	checkError(err)
	return &alItms
}

// Singleton will return a single requested Data Item to allow editing of a single Data Item within a template
func Singleton(i int) (au **Item) {
	// here we can use viper to find the data directory
	file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR|os.O_APPEND, 0666)
	checkError(err)
	b, err := ioutil.ReadAll(file)
	var alItms AllItems
	json.Unmarshal(b, &alItms.Items)
	checkError(err)

	for _, itm := range alItms.Items {
		if itm.Id == i {
			return &itm
		}
	}

	return
}

// Below will be model data for settings and pluginRepo

// ServSetting is a struct to contain the Server Settings or serverSettings.json data
type ServSetting struct {
	Name     string `json:"name"`
	Version  string `json:"version"`
	Author   string `json:"author"`
	Language string `json:"lang"`
}

// ServSettingGet returns the item of Server Settings to allow templating
func ServSettingGet() (au *ServSetting) {
	file, err := os.OpenFile(viper.GetString("directories.setting")+"/serverSettings.json", os.O_RDWR|os.O_APPEND, 0666)
	checkError(err)
	b, err := ioutil.ReadAll(file)
	var srvStting ServSetting
	json.Unmarshal(b, &srvStting)
	checkError(err)
	return &srvStting
}

// ServSettingSetLang is made to modify the server settings language value only
func ServSettingSetLang(newLang string) (string, error) {
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

	// Then with the original file unpacked, we can modify the language variable and write it back to its file
	if origSrvStting.Language != newLang {
		origSrvStting.Language = newLang
	} else {
		return "No Change Needed to Server Language from: " + newLang, nil
	}

	newSrvStting, err := json.MarshalIndent(&origSrvStting, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	ioutil.WriteFile(viper.GetString("directories.setting")+"/serverSettings.json", newSrvStting, 0666)

	return "Successfully Changed Server Language to: " + newLang, nil
}

// UserSetting struct is made to contain the JSON of User settings
type UserSetting struct {
	CustomBackground usrStgBck `json:"customBackground"`
}

type usrStgBck struct {
	Set    bool   `json:"set"`
	Src    string `json:"src"`
	Repeat string `json:"repeat"`
	Size   string `json:"size"`
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

// UserSettingSet is used to write new user settings to disk
func UserSettingSet(rw http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	checkError(err)
	fmt.Println(string(body))
	var upldUsr UserSetting
	err = json.Unmarshal(body, &upldUsr)
	checkError(err)
	fmt.Println(upldUsr)
	// now after confirming the data can be unmarshalled into the struct, and logging it, we can write it
	newUserSetting, err := json.MarshalIndent(&upldUsr, "", "")
	checkError(err)
	ioutil.WriteFile(viper.GetString("directories.setting")+"/userSettings.json", newUserSetting, 0666)

}
