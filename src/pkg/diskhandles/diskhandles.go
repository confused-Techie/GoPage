package diskhandles

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

// ReadFromDiskToBytes takes a string location of a file, and returns the bytes of that file after being read or an error
func ReadFromDiskToBytes(location string) ([]byte, error) {
	file, err := os.OpenFile(location, os.O_RDWR|os.O_APPEND, 0666)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	return bytes, nil
}

// WriteToDiskFromUnmarshal takes an interface object that will be Marshaled, and a string to write the marshaled data to.
// Returning an string "Success" or an error.
func WriteToDiskFromUnmarshal(data interface{}, location string) (string, error) {
	newData, err := json.MarshalIndent(&data, "", "")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	ioutil.WriteFile(location, newData, 0666)

	return "Success", nil
}
