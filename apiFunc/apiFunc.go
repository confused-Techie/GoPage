package apiFunc

import (
  "time"
  "net/http"
  "os"
  "fmt"
  "github.com/spf13/viper"
  "io/ioutil"
  "encoding/json"
  "os/exec"
  "runtime"
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
