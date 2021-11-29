package main

import (
  model "github.com/confused-Techie/GoPage/model"
  config "github.com/confused-Techie/GoPage/config"
  "fmt"
  "log"
  "net/http"
  "html/template"
  "strconv"
  "os"
  "io/ioutil"
  "encoding/json"
  "github.com/spf13/viper"
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

  a, errr := strconv.Atoi(r.FormValue("id"))
  checkError(errr)
  updateItem.Id = a
  var err error

  // open file
  file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
  checkError(err)
  defer file.Close()

  b, err := ioutil.ReadAll(file)
  var allItms model.AllItems
  err = json.Unmarshal(b, &allItms.Items)
  checkError(err)

  for i, itm := range allItms.Items {
    if itm.Id == updateItem.Id {
      allItms.Items[i].FriendlyName = updateItem.FriendlyName
      allItms.Items[i].Link = updateItem.Link
      allItms.Items[i].Category = updateItem.Category
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
  defer file.Close()

  // read file and unmarshall json to []items
  b, err := ioutil.ReadAll(file)
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
    var err error
    //open file
    file, err := os.OpenFile(viper.GetString("directories.data"), os.O_RDWR, 0644)
    checkError(err)
    defer file.Close()

    //read file and unmarshall json file to slice of users
    b, err := ioutil.ReadAll(file)
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
  defer
  file.Close()

  b, err := ioutil.ReadAll(file)
  var alItms model.AllItems
  err = json.Unmarshal(b, &alItms.Items)
  checkError(err)

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusCreated)
  json.NewEncoder(w).Encode(alItms.Items)
}

func main() {
  // Here we can add all viper configuration file/env file setup
  // this will grab the proper config location, home of windows or linux, or if dev flag used the local dir
  workEnv := config.DetermineEnv()

  fmt.Println("Reading Config: \t", workEnv)

  // this will then try to grab the config data
  config, err := config.LoadConfig(workEnv)
  if err != nil {
    log.Fatal("Cannot load Config: ", err)
  }

  // Reading variables using the model. This is for dev purposes
  fmt.Println("Server Port: \t", config.Server.Port)

  http.HandleFunc("/", homeHandler)

  http.HandleFunc("/update/", updateHandler)
  http.HandleFunc("/delete/", deleteHandler)
  http.HandleFunc("/edit/", editHandler)
  http.HandleFunc("/new/", newHandler)

  // now to allow static file serving for css and js assets
  fs := http.FileServer(http.Dir(viper.GetString("directories.staticAssets")))
  http.Handle("/assets/", http.StripPrefix("/assets/", fs))

  // For the proper filtering of items, and hopeful searching, here will be an api call for js to get all items as json
  http.HandleFunc("/api/items", apiItemsHandler)

  // We are wrapping the listen in log.Fatal since it will only ever return an error, but otherwise nil
  log.Fatal(http.ListenAndServe(":" + viper.GetString("server.port"), nil))
}
