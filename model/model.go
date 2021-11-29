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
  fmt.Println("Test Getting data from singleton: \t ", viper.Get("directories.data"))

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
