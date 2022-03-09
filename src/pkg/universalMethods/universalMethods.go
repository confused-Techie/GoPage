package universalMethods

import (
	"fmt"
	"os"
	"strings"
	"time"
)

// LogInjectionAvoidance will do basic sanitization of strings before being put into the log
func LogInjectionAvoidance(input string) string {
	// This will attempt to sanitize input that will be written to logs
	escapedInput := strings.Replace(input, "\n", "", -1)
	escapedInput = strings.Replace(escapedInput, "\r", "", -1)
	return escapedInput
}

// LastModifiedTime returns the ModTime of the requested string, assuming a relative path provided
func LastModifiedTime(filename string) string {
	// Since I know where assets is located, we can just append the . here
	fileLoc := "." + filename
	file, err := os.Stat(fileLoc)

	if err != nil {
		fmt.Println(err)
	}
	modifiedtime := file.ModTime()
	formatedTime := modifiedtime.UTC().Format(time.RFC1123)
	return formatedTime
}

// StringInSlice is a simple method to implement JS Array.prototype.includes()
func StringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}

func WhichStringInSlice(a string, list []string) int {
	for i, b := range list {
		if b == a {
			return i
		}
	}
	return -1
}
