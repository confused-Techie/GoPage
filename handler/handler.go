package handler

import (
	"fmt"
	"github.com/spf13/viper"
	"io/ioutil"
	"net/http"
)

// UploadHandler is paired to http.HandleFunc("/upload", ) to handle the digestion of image uploads to GoPage
func UploadHandler(w http.ResponseWriter, r *http.Request) {
	// Parse our multipart form, 10 << 20 specifies a mazimum upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)
	//FormFile returns the first file for the given key 'myFile'
	// it also returns the fileheader so we can get the fielname,
	// the header and the size of the file
	file, handler, err := r.FormFile("myFile")
	if err != nil {
		fmt.Println("Error Retrieving the File...")
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	// Create a temporary file within our temp-images directory that follows
	// a particular naming pattern
	tempFile, err := ioutil.TempFile(viper.GetString("directories.staticAssets")+"userImages", "upload-*.png")
	if err != nil {
		fmt.Println(err)
	}
	defer tempFile.Close()

	// read all of the contents of our uploaded file into a byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}
	// write this byte array to our temporary file
	tempFile.Write(fileBytes)
	// return that we have successfully uploaded our file
	fmt.Println("Successfully Uploaded File")

	// After successfully uploading the file, redirect to the home page
	http.Redirect(w, r, "/uploadpage", 301)
}
