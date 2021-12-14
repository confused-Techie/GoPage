package apiFunc

import (
  "time"
  "net/http"
  "os"
  "fmt"
  "github.com/spf13/viper"
  "io"
  "io/ioutil"
  "encoding/json"
  "os/exec"
  "runtime"

  "strings"
  "path/filepath"
  "archive/zip"
  )

var client = http.Client{
  Timeout: 2 * time.Second,
}

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


func HostSettingGet() (string, error) {
  return os.Hostname()
}

func HostOSGet() string {
  return os.Getenv("OS")
}

// This will be dedicated to the plugin store
type PluginIcon struct {
  Available bool `json:"available"`
  Type string `json:"type"`
  Source string `json:"src"`
  Style string `json:"style"`
  Symbol string `json:"symbol"`
}

type AvailablePluginItem struct {
  Name string `json:"name"`
  FriendlyName string `json:"friendlyName"`
  Version string `json:"version"`
  Description string `json:"description"`
  Type string `json:"type"`
  Author string `json:"author"`
  License string `json:"license"`
  InfoLink string `json:"infoLink"`
  DownloadLink string `json:"downloadLink"`
  Installed bool `json:"installed"`
  Icon PluginIcon `json:"icon"`
}

type AvailablePluginList struct {
  AvailablePluginItem []*AvailablePluginItem
}

type PluginItem struct {
  Name string `json:"name"`
  FriendlyName string `json:"friendlyName"`
  Version string `json:"version"`
  Description string `json:"description"`
  Type string `json:"type"`
  Author string `json:"author"`
  License string `json:"license"`
  InfoLink string `json:"infoLink"`
  DownloadLink string `json:"downloadLink"`
  Icon PluginIcon `json:"icon"`
}

type InstalledPlugins struct {
  PluginItem []PluginItem
}

type InstallItem struct {
  Name string `json:"name"`
}

type InstallList struct {
  InstallItem []*InstallItem
}

func checkError(err error) {
  if err != nil {
    fmt.Println(err)
  }
}

func AvailablePlugins() (au *AvailablePluginList) {
  file, err := os.OpenFile(viper.GetString("directories.plugin") + "availablePlugins.json", os.O_RDWR|os.O_APPEND, 0666)
  checkError(err)
  b, err := ioutil.ReadAll(file)
  var alPlg AvailablePluginList
  json.Unmarshal(b, &alPlg.AvailablePluginItem)
  checkError(err)
  return &alPlg
}

func (list *InstalledPlugins) AddItemToList(item PluginItem) []PluginItem {
  list.PluginItem = append(list.PluginItem, item)
  return list.PluginItem
}


func GetInstalledPluginsList() (au *InstalledPlugins) {
  file, err := os.OpenFile(viper.GetString("directories.plugin") + "installedPlugins.json", os.O_RDWR|os.O_APPEND, 0666)
  checkError(err)
  b, err := ioutil.ReadAll(file)
  var instList InstallList
  json.Unmarshal(b, &instList.InstallItem)
  checkError(err)
  //return &instList

  plugDataItems := []PluginItem{}
  plugDataList := InstalledPlugins{plugDataItems}

  for _, itm := range instList.InstallItem {
    //fmt.Println("Maybe Plugin Name: /t"+itm.Name)
    var p = viper.GetString("directories.plugin") + string(itm.Name) + "/package.json"
    file2, err := os.OpenFile(p, os.O_RDWR|os.O_APPEND, 0666)
    checkError(err)
    b, err := ioutil.ReadAll(file2)
    var plgItm PluginItem
    json.Unmarshal(b, &plgItm)
    checkError(err)
    //fmt.Println(&plgItm)
    plugDataList.AddItemToList(plgItm)
  }
  //fmt.Println(plugDataList)


  return &plugDataList
}

// This will combine the installed plugin data as well as the availabel plugin data, to return one item
type PluginData struct {
  Installed *InstalledPlugins
  Available *AvailablePluginList
}

func GetPluginData() (au *PluginData) {
  resp := GetInstalledPluginsList()
  resp1 := AvailablePlugins()
  data := &PluginData{resp, resp1}
  return data
}


func CmdTest(src string) string {
  // get 'go' executable path
  //goExecutable, _ := exec.LookPath( "go" )
  // go version command
  //cmdGoVer := &exec.Cmd {
  //  Path: goExecutable,
  //  Args: []string{ goExecutable, "version" },
  //  Stdout: os.Stdout,
  //  Stderr: os.Stdout,
  //}

  // see command represented by 'cmdGoVer'
  //fmt.Println( cmdGoVer.String() )
  // run the command
  //if err := cmdGoVer.Run(); err != nil {
  //  fmt.Println("Error:", err);
  //}

  fmt.Println(os.Getenv("OS"))
  fmt.Println(runtime.GOOS)
  fmt.Println(src)
  // construct go version command
  //cmd := exec.Command( "go", "version" )

  // run command and wait on output
  //if otuput, err := cmd.Output(); err != nil {
  //  fmt.Println("Error:", err)
  //} else {
  //  fmt.Printf("Otuput: %s\n", otuput)
  //}

  if runtime.GOOS == "windows" {

    // Knowing this is windows we can craft a command for the windows plugin installer
    //data := viper.GetString("directories.scripts")
    cmd := exec.Command( "PowerShell", "-Command", "./scripts/windowsPluginInstaller.ps1", "-source", src )
    fmt.Println(cmd)
    if out, err := cmd.Output(); err != nil {
      fmt.Println("Error:", err)
    } else {
      fmt.Printf("Output: %s\n", out)

      return fmt.Sprintf("%s\n", out)
    }
  } else if runtime.GOOS == "darwin" {
    fmt.Println("Fuck you Apple")
  }

  return "Shit"
}

func InstallCmd(src string) (string, error) {
  // Here we can call the scripts to install new commands.

  if runtime.GOOS == "windows" {

    cmd := exec.Command( "PowerShell", "-File", "./scripts/windowsPluginInstaller.ps1", "-source", src, "-dest", viper.GetString("directories.plugin"))

    if out, err := cmd.Output(); err != nil {
      fmt.Println("Error:", err)
      return "", err
    } else {
      // %s\n here used to format the return of bytes as text, which in main will be encoded as json
      fmt.Printf("Output: %s\n", out)
      return fmt.Sprintf("%s\n", out), nil
    }
  } else if runtime.GOOS == "darwin" {

  }

  return "Generic Error", nil
}

func UninstallCmd(name string) (string, error) {
  // Here we can call the script to uninstall

  if runtime.GOOS == "windows" {

    cmd := exec.Command( "PowerShell", "-File", "./scripts/windowsPluginUninstaller.ps1", "-pluginName", name, "-dest", viper.GetString("directories.plugin") )

    if out, err := cmd.Output(); err != nil {
      fmt.Println("Error:", err)
      return "", err
    } else {
      fmt.Printf("Output: %s\n", out)
      return fmt.Sprintf("%s\n", out), nil
    }
  } else if runtime.GOOS == "darwin" {

  }

  return "Generic Error", nil
}

type UniversalPluginOptions struct {
  Explain string `json:"explain"`
  Autofill string `json:"autofill"`
}

type UniversalPluginIcon struct {
  Available bool `json:"available"`
  Type string `json:"type"`

  Src string `json:"src"`

  Style string `json:"style"`
  Symbol string `json:"symbol"`
}

type UniversalPluginItem struct {
  Name string `json:"name"`
  FriendlyName string `json:"friendlyName"`
  Version string `json:"version"`
  Description string `json:"description"`
  Type string `json:"item"`
  Author string `json:"author"`
  License string `json:"license"`
  InfoLink string `json:"infoLink"`
  DownloadLink string `json:"downloadLink"`
  Installed bool `json:"installed"`
  Config bool `json:"config"`
  MainDir string `json:"mainDir"`
  Main string `json:"main"`
  Options UniversalPluginOptions `json:"options"`
  Icon UniversalPluginIcon `json:"icon"`
}

type UniversalPluginList struct {
  UniversalPluginItem []*UniversalPluginItem
}

func UninstallUniversal(pluginName string) (string, error) {
  // We want to first remove the old files
  fmt.Println("Uninstalling Plugin: " + pluginName)

  rmvPlg := os.RemoveAll(viper.GetString("directories.plugin") + pluginName)
  if rmvPlg != nil {
    fmt.Println(rmvPlg)
    return "", rmvPlg
  }

  fmt.Println("Successfully removed Plugin Data...")

  availablePluginFile, err := os.OpenFile(viper.GetString("directories.plugin") + "availablePlugins.json", os.O_RDWR|os.O_APPEND, 0666)
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
      fmt.Println("Matching Data: " + itm.Name + ":" + pluginName)
      itm.Installed = false
    }
  }
  // Now with the modified available Plugin data , we can write it
  newAvailablePluginList, err := json.MarshalIndent(&availablePluginList.UniversalPluginItem, "", "")
  if err != nil {
    fmt.Println(err)
    return "", err
  }
  ioutil.WriteFile(viper.GetString("directories.plugin") + "availablePlugins.json", newAvailablePluginList, 0666)

  fmt.Println("Successfully Wrote Updated Available Plugin Data...")

  // Next we want to modify the installedPlugin file
  installedPluginFile, err := os.OpenFile(viper.GetString("directories.plugin") + "installedPlugins.json", os.O_RDWR|os.O_APPEND, 0666)
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
      fmt.Println("Matching Data: " + itm.Name + ":" + pluginName)
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
  ioutil.WriteFile(viper.GetString("directories.plugin") + "installedPlugins.json", newInstalledPluginList, 0666)

  fmt.Println("Successfully Wrote Updated Installed Plugin Data...")

  return "Success", err
}

func InstallUniversal(src string) (string, error) {
  // Due to file limitations of Powershell, and the issue of building
  // Scripts per platform, lets see if we can use Go to handle the grunt work
  fmt.Println("Installed New Plugin from: " + src)

  // The below here will download the file
  var createPath = viper.GetString("directories.plugin") + "pluginTemp.zip"
  out, err := os.Create(createPath)
  if err != nil {
    return "", err
  }
  //defer out.Close()

  // Get the data
  resp, err := http.Get(src)
  if err != nil {
    return "", err
  }
  //defer resp.Body.Close()

  // Check server response
  if resp.StatusCode != http.StatusOK {
    return "", fmt.Errorf("bad status: %s", resp.Status)
  }

  // Write the body to file
  _, err = io.Copy(out, resp.Body)
  if err != nil {
    return "", err
  }
  //return "Success", nil
  out.Close()
  resp.Body.Close()

  fmt.Println("Successfully Downloaded Plugin Data...")

  // Now the file should be successfully downloaded and we need to unpack in place

  unpackFiles, err := Unzip(createPath, viper.GetString("directories.plugin") + "pluginTemp")
  if err != nil {
    fmt.Println(err)
    return "", err
  }

  fmt.Println("Unzipped:\n" + strings.Join(unpackFiles, "\n"))

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
  // Now the temp file and plugin archive should be deleted
  //return "Success!", nil

  availablePluginFile, err := os.OpenFile(viper.GetString("directories.plugin") + "availablePlugins.json", os.O_RDWR|os.O_APPEND, 0666)
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
  packagePluginFile, err := os.OpenFile(viper.GetString("directories.plugin") + parentFiles[0].Name() + "/package.json", os.O_RDWR|os.O_APPEND, 0666)
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
  ioutil.WriteFile(viper.GetString("directories.plugin") + "availablePlugins.json", newAvailablePluginList, 0666)

  fmt.Println("Successfully Wrote Updated Available Plugin Data...")

  // Now its time to update the installed data list
  installedPluginFile, err := os.OpenFile(viper.GetString("directories.plugin") + "installedPlugins.json", os.O_RDWR|os.O_APPEND, 0666)
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
  ioutil.WriteFile(viper.GetString("directories.plugin") + "installedPlugins.json", newInstalledPluginList, 0666)

  fmt.Println("Successfully Wrote updated Installed Plugin Data...")

  return "Success", err

  // This son of a bitch works, beautful
}

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
