package model

import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "os"
  "github.com/spf13/viper"
)


type Item struct {
  Id int `json:"id"`
  FriendlyName string `json:"friendlyName"`
  Link string `json:"link"`
  Category string `json:"category"`
  LeftPlugin string `json:"left-plugin"`
  CenterPlugin string `json:"center-plugin"`
  RightPlugin string `json:"right-plugin"`
}

type AllItems struct {
  Items []*Item
}

func checkError(err error) {
  if err != nil {
    fmt.Println(err)
  }
}

func Home() (au *AllItems) {
  file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR|os.O_APPEND, 0666)
  checkError(err)
  b, err := ioutil.ReadAll(file)
  var alItms AllItems
  json.Unmarshal(b, &alItms.Items)
  checkError(err)
  return &alItms
}

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

type ServSetting struct {
  Name string `json:"name"`
  Version string `json:"version"`
  Author string `json:"author"`
}

func ServSettingGet() (au *ServSetting) {
  file, err := os.OpenFile(viper.GetString("directories.setting") + "/serverSettings.json", os.O_RDWR|os.O_APPEND, 0666)
  checkError(err)
  b, err := ioutil.ReadAll(file)
  var srvStting ServSetting
  json.Unmarshal(b, &srvStting)
  checkError(err)
  return &srvStting
}
