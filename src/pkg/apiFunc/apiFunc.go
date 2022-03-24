package apiFunc

import (
	"archive/zip"
	"crypto/tls"
	"encoding/json"
	"fmt"
	universalMethods "github.com/confused-Techie/GoPage/src/pkg/universalMethods"
	"github.com/spf13/viper"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"time"
)

var client = http.Client{
	Timeout: 2 * time.Second,
}

// Ping mimics the command line utility ping while just returning the HTTP Status Code and nothing else
func Ping(domain string) (int, error) {
	req, err := http.NewRequest("HEAD", domain, nil)
	if err != nil {
		return 0, err
	}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	resp.Body.Close()
	return resp.StatusCode, nil
}

// PingNoSSL mimics the command line utility ping, returning the HTTP Status Code, but ignoring certificates, to aide self-hosted status checks
func PingNoSSL(domain string) (int, error) {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	resp, err := client.Get(domain)
	if err != nil {
		return 0, err
	}
	resp.Body.Close()
	return resp.StatusCode, nil

}

// HostSettingGet uses the os package to return the system's hostname
func HostSettingGet() (string, error) {
	return os.Hostname()
}

// HostOSGet returns basic information about the host system operating system and/or architecture
func HostOSGet() string {
	// Since this originally would only return a value on a windows based system
	if runtime.GOOS == "windows" {
		return os.Getenv("OS")
	}
	return runtime.GOOS + "/" + runtime.GOARCH
}

// ------------------------------------------
// This will be dedicated to the plugin store

// UniversalPluginOptions is a child of UniversalPluginItem the attempt at de-duplication of plugin Item models
type UniversalPluginOptions struct {
	Explain  string `json:"explain"`
	Autofill string `json:"autofill"`
}

// UniversalPluginIcon is a child of UniversalPluginItem the attempt at de-duplication of plugin item models
type UniversalPluginIcon struct {
	Available bool   `json:"available"`
	Type      string `json:"type"`
	Src       string `json:"src"`
	Style     string `json:"style"`
	Symbol    string `json:"symbol"`
}

// UniversalPluginItem is the attempt at de-duplication of plugin item models
type UniversalPluginItem struct {
	Name         string                 `json:"name"`
	FriendlyName string                 `json:"friendlyName"`
	Version      string                 `json:"version"`
	Description  string                 `json:"description"`
	Type         string                 `json:"type"`
	Author       string                 `json:"author"`
	License      string                 `json:"license"`
	InfoLink     string                 `json:"infoLink"`
	DownloadLink string                 `json:"downloadLink"`
	Installed    bool                   `json:"installed"`
	Config       bool                   `json:"config"`
	MainDir      string                 `json:"mainDir"`
	Main         string                 `json:"main"`
	Options      UniversalPluginOptions `json:"options"`
	Icon         UniversalPluginIcon    `json:"icon"`
}

// UniversalPluginList holds the array of UniversalPluginItem 's as the attempt of de-duplication of plugin item models
type UniversalPluginList struct {
	UniversalPluginItem []*UniversalPluginItem
}

// UniversalDualPluginList holds two arrays of UniversalPluginItem's. One named available and the other named installed
type UniversalDualPluginList struct {
	Available *UniversalPluginList
	Installed *UniversalPluginList
}

func checkError(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

// GetPluginList takes the target string plugin list, and returns it as a UniversalPluginList item
func GetPluginList(source string) (au *UniversalPluginList) {
	file, err := os.OpenFile(viper.GetString("directories.plugin")+source, os.O_RDWR|os.O_APPEND, 0666)
	checkError(err)
	b, err := ioutil.ReadAll(file)
	var alPlg UniversalPluginList
	json.Unmarshal(b, &alPlg.UniversalPluginItem)
	checkError(err)
	return &alPlg
}

// GetDualPluginList will return a UniversalDualPluginList item with both installed and available plugins
func GetDualPluginList() (au *UniversalDualPluginList) {
	installed := GetPluginList("installedPlugins.json")
	available := GetPluginList("availablePlugins.json")
	data := &UniversalDualPluginList{available, installed}
	return data
}

// UninstallUniversal uses Go functions and libraries to uninstall plugins rather than powershell scripts and is the currently used method
func UninstallUniversal(pluginNameRaw string) (string, error) {
	var consoleData string
	// We want to first remove the old files
	fmt.Println("Uninstalling Plugin: " + universalMethods.LogInjectionAvoidance(pluginNameRaw))
	consoleData = consoleData + "Uninstalling Plugin: " + pluginNameRaw + "... \n"

	ptStatus, pluginName := universalMethods.PathTraversalAvoidance(pluginNameRaw)

	if ptStatus {
		fmt.Println(pluginName)
		return pluginName, nil
	}

	rmvPlg := os.RemoveAll(viper.GetString("directories.plugin") + pluginName)
	if rmvPlg != nil {
		fmt.Println(rmvPlg)
		return "", rmvPlg
	}

	fmt.Println("Successfully removed Plugin Data...")
	consoleData = consoleData + "Successfully removed Plugin Data... \n"

	availablePluginFile, err := os.OpenFile(viper.GetString("directories.plugin")+"availablePlugins.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	availablePluginBytes, err := ioutil.ReadAll(availablePluginFile)
	var availablePluginList UniversalPluginList
	json.Unmarshal(availablePluginBytes, &availablePluginList.UniversalPluginItem)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// now with the available data we can loop through it
	for _, itm := range availablePluginList.UniversalPluginItem {
		if itm.Name == pluginName {
			fmt.Println("Matching Data: " + universalMethods.LogInjectionAvoidance(itm.Name) + ":" + universalMethods.LogInjectionAvoidance(pluginName))
			itm.Installed = false
		}
	}
	// Now with the modified available Plugin data , we can write it
	newAvailablePluginList, err := json.MarshalIndent(&availablePluginList.UniversalPluginItem, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	ioutil.WriteFile(viper.GetString("directories.plugin")+"availablePlugins.json", newAvailablePluginList, 0666)

	fmt.Println("Successfully Wrote Updated Available Plugin Data...")
	consoleData = consoleData + "Successfully Wrote Updated Available Plugin Data... \n"

	// Next we want to modify the installedPlugin file
	installedPluginFile, err := os.OpenFile(viper.GetString("directories.plugin")+"installedPlugins.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	installedPluginBytes, err := ioutil.ReadAll(installedPluginFile)
	var installedPluginList UniversalPluginList
	json.Unmarshal(installedPluginBytes, &installedPluginList.UniversalPluginItem)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// now we can loop through the installed plugin list
	for i, itm := range installedPluginList.UniversalPluginItem {
		if itm.Name == pluginName {
			fmt.Println("Matching Data: " + universalMethods.LogInjectionAvoidance(itm.Name) + ":" + universalMethods.LogInjectionAvoidance(pluginName))
			// now to remove this item from the list all together
			installedPluginList.UniversalPluginItem = append(installedPluginList.UniversalPluginItem[:i], installedPluginList.UniversalPluginItem[i+1:]...)
			// From Slice tricks to delete the element at i position
		}
	}

	newInstalledPluginList, err := json.MarshalIndent(&installedPluginList.UniversalPluginItem, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	ioutil.WriteFile(viper.GetString("directories.plugin")+"installedPlugins.json", newInstalledPluginList, 0666)

	fmt.Println("Successfully Wrote Updated Installed Plugin Data...")
	consoleData = consoleData + "Successfully Wrote Updated Installed Plugin Data... \n"
	consoleData = consoleData + "Success!"

	return consoleData, err
}

// InstallUniversal is the currently used method to install plugins ditching windows powershell scripts of earlier versions
func InstallUniversal(src string) (string, error) {
	var consoleData string
	// Due to file limitations of Powershell, and the issue of building
	// Scripts per platform, lets see if we can use Go to handle the grunt work
	fmt.Println("Installed New Plugin from: " + universalMethods.LogInjectionAvoidance(src))
	consoleData = consoleData + "Installed New Plugin from: " + src + "... \n"

	// The below here will download the file
	var createPath = viper.GetString("directories.plugin") + "pluginTemp.zip"
	out, err := os.Create(createPath)
	if err != nil {
		return "", err
	}

	// Get the data
	urlCheckMatch := regexp.MustCompile(`^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?`)
	urlGithubOnly := regexp.MustCompile(`^(w{3}\.github\.com)|(github\.com)`)

	urlHostName := urlCheckMatch.FindStringSubmatch(src)[4]

	if !urlGithubOnly.MatchString(urlHostName) {
		return "Unable to Install. Only Github Sources allowed at this time.", nil
	}

	resp, err := http.Get(src)
	if err != nil {
		return "", err
	}

	// Check server response
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("bad status: %s", resp.Status)
	}

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return "", err
	}
	out.Close()
	resp.Body.Close()

	fmt.Println("Successfully Downloaded Plugin Data...")
	consoleData = consoleData + "Successfully Downloaded Plugin Data... \n"

	// Now the file should be successfully downloaded and we need to unpack in place

	unpackFiles, err := Unzip(createPath, viper.GetString("directories.plugin")+"pluginTemp")
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	fmt.Println("Unzipped:\n" + strings.Join(unpackFiles, "\n"))
	consoleData = consoleData + "Unzipped:\n" + strings.Join(unpackFiles, "\n") + "... \n"

	// then we need to get the top level folder to be able and move it properly
	parentFiles, err := ioutil.ReadDir(viper.GetString("directories.plugin") + "pluginTemp")
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// now with the top level folder name, we can move the file
	oldLocation := viper.GetString("directories.plugin") + "pluginTemp/" + parentFiles[0].Name()
	newLocation := viper.GetString("directories.plugin") + parentFiles[0].Name()
	errM := os.Rename(oldLocation, newLocation)
	if errM != nil {
		fmt.Println(errM)
		return "", errM
	}

	fmt.Println("Moved Unpacked Plugin to Plugin Folder...")
	consoleData = consoleData + "Moved Unpacked Plugin to Plugin Folder... \n"

	// Next we want to cleanup previous files
	rmvPkg := os.Remove(viper.GetString("directories.plugin") + "pluginTemp.zip")
	if rmvPkg != nil {
		fmt.Println(rmvPkg)
		return "", rmvPkg
	}

	rmvTmp := os.Remove(viper.GetString("directories.plugin") + "pluginTemp/")
	if rmvTmp != nil {
		fmt.Println(rmvTmp)
		return "", rmvTmp
	}

	fmt.Println("Successfully Preformed File Cleanup...")
	consoleData = consoleData + "Successfully Preformed File Cleanup... \n"
	// Now the temp file and plugin archive should be deleted

	availablePluginFile, err := os.OpenFile(viper.GetString("directories.plugin")+"availablePlugins.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	availablePluginBytes, err := ioutil.ReadAll(availablePluginFile)
	var availablePluginList UniversalPluginList
	json.Unmarshal(availablePluginBytes, &availablePluginList.UniversalPluginItem)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// with the data from the available list we want to find the entry of this item, and remove it.
	// which will require use to get the package data
	fmt.Println("Parent files" + parentFiles[0].Name())
	packagePluginFile, err := os.OpenFile(viper.GetString("directories.plugin")+parentFiles[0].Name()+"/package.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	packagePluginBytes, err := ioutil.ReadAll(packagePluginFile)
	var packagePluginData UniversalPluginItem
	json.Unmarshal(packagePluginBytes, &packagePluginData)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// now with both we will loop through the available list to find our entry
	for _, itm := range availablePluginList.UniversalPluginItem {
		if itm.Name == packagePluginData.Name {
			fmt.Println("Matching Data, " + itm.Name + ":" + packagePluginData.Name)
			itm.Installed = true
		}
	}
	// Now with all the data written hopefully we want to write the file back
	newAvailablePluginList, err := json.MarshalIndent(&availablePluginList.UniversalPluginItem, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	ioutil.WriteFile(viper.GetString("directories.plugin")+"availablePlugins.json", newAvailablePluginList, 0666)

	fmt.Println("Successfully Wrote Updated Available Plugin Data...")
	consoleData = consoleData + "Successfully Wrote Updated Available Plugin Data... \n"

	// Now its time to update the installed data list
	installedPluginFile, err := os.OpenFile(viper.GetString("directories.plugin")+"installedPlugins.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	installedPluginBytes, err := ioutil.ReadAll(installedPluginFile)
	var installedPluginList UniversalPluginList
	json.Unmarshal(installedPluginBytes, &installedPluginList.UniversalPluginItem)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// now with the installed plugin data we can append our new data to it

	// But first we need to update the installed status for the new plugin data
	packagePluginData.Installed = true
	installedPluginList.UniversalPluginItem = append(installedPluginList.UniversalPluginItem, &packagePluginData)
	newInstalledPluginList, err := json.MarshalIndent(&installedPluginList.UniversalPluginItem, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	ioutil.WriteFile(viper.GetString("directories.plugin")+"installedPlugins.json", newInstalledPluginList, 0666)

	fmt.Println("Successfully Wrote updated Installed Plugin Data...")
	consoleData = consoleData + "Successfully Wrote updated Installed Plugin Data... \n"
	consoleData = consoleData + "Success!"

	return consoleData, err

	// This son of a bitch works, beautful
}

// UniversalAvailableUpdate is the Go function reliant method to update available plugins directly from the Github repo without a feature update needed.
func UniversalAvailableUpdate() (string, error) {
	var consoleData string

	fmt.Println("Checking for new Available Updates...")
	consoleData = consoleData + "Checking for new Available Updates... \n"

	// First we will download the current available plugin file from github
	var createPath = viper.GetString("directories.plugin") + "availablePluginsTemp.json"
	out, err := os.Create(createPath)
	if err != nil {
		return "", err
	}

	resp, err := http.Get("https://raw.githubusercontent.com/confused-Techie/GoPage/main/data/plugins/availablePlugins.json")
	if err != nil {
		return "", err
	}

	// check server response
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("bad status: %s", resp.Status)
	}

	// write the body to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return "", err
	}

	// Close the file handles
	out.Close()
	resp.Body.Close()

	fmt.Println("Successfully Downloaded Available Plugin Data...")
	consoleData = consoleData + "Successfully Downloaded Available Plugin Data... \n"

	// now the file should be successfully downlaoed and we need to compare against current data

	availablePluginFile, err := os.OpenFile(viper.GetString("directories.plugin")+"availablePlugins.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	availablePluginBytes, err := ioutil.ReadAll(availablePluginFile)
	var availablePluginList UniversalPluginList
	json.Unmarshal(availablePluginBytes, &availablePluginList.UniversalPluginItem)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// Then we need to grab the data from the newly downloaded available file

	availablePluginTempFile, err := os.OpenFile(viper.GetString("directories.plugin")+"availablePluginsTemp.json", os.O_RDWR|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	availablePluginTempBytes, err := ioutil.ReadAll(availablePluginTempFile)
	var availablePluginTempList UniversalPluginList
	json.Unmarshal(availablePluginTempBytes, &availablePluginTempList.UniversalPluginItem)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	fmt.Println("Successfully Read Data from current and new Available Plugins...")
	consoleData = consoleData + "Successfully Read Data from current and new Available Plugins..."

	newAvailablePluginList, err := json.MarshalIndent(&availablePluginTempList.UniversalPluginItem, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// now its time to write the new data into the existing file
	ioutil.WriteFile(viper.GetString("directories.plugin")+"availablePlugins.json", newAvailablePluginList, 0666)

	fmt.Println("Successfully Wrote new Available Plugin Data to File...")
	consoleData = consoleData + "Successfully Wrote new Available Plugin Data to File... \n"

	// But before files can be deleted we need to ensure we have no active handlers with them
	availablePluginTempFile.Close()
	// then we want to delete the temp file leftover
	rmvTmp := os.Remove(viper.GetString("directories.plugin") + "availablePluginsTemp.json")
	if rmvTmp != nil {
		fmt.Println(rmvTmp)
		return "", rmvTmp
	}

	fmt.Println("Successfully removed temporary files...")
	consoleData = consoleData + "Successfully removed temporary files... \n"

	consoleData = consoleData + "Success!"

	return consoleData, err
}

// Unzip is used during InstallUniversal to unpack the plugin zip files and install them
func Unzip(src string, dest string) ([]string, error) {

	var filenames []string

	r, err := zip.OpenReader(src)
	if err != nil {
		return filenames, err
	}
	defer r.Close()

	for _, f := range r.File {

		// Store filename/path for returning and using later on
		fpath := filepath.Join(dest, f.Name)

		// Check for ZipSlip
		if !strings.HasPrefix(fpath, filepath.Clean(dest)+string(os.PathSeparator)) {
			return filenames, fmt.Errorf("%s: Illegal File Path", fpath)
		}

		filenames = append(filenames, fpath)

		if f.FileInfo().IsDir() {
			// Make folder
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}

		// make file
		if err = os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
			return filenames, err
		}

		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return filenames, err
		}

		rc, err := f.Open()
		if err != nil {
			return filenames, err
		}

		_, err = io.Copy(outFile, rc)

		// Close the file without defer to close before next iteration of loop
		outFile.Close()
		rc.Close()

		if err != nil {
			return filenames, err
		}
	}
	// Adding r.Close() here rather than defer to ensure any handlers are
	// no longer touching the file to be deleted
	//r.Close()

	return filenames, nil
}
