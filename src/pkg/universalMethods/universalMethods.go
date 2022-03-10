package universalMethods

import (
	"fmt"
	"os"
	"strings"
	"time"
	"regexp"
)

// LogInjectionAvoidance will do basic sanitization of strings before being put into the log
func LogInjectionAvoidance(input string) string {
	// This will attempt to sanitize input that will be written to logs
	escapedInput := strings.Replace(input, "\n", "", -1)
	escapedInput = strings.Replace(escapedInput, "\r", "", -1)
	return escapedInput
}

// PathTraversalAvoidance will do basic sanitization of strings before returning for accessing the filesystem
func PathTraversalAvoidance(input string) (bool, string) {
	// define different regex matchers
	unixBackNav := regexp.MustCompile(`(\.{2}\/)`) // ../
	unixBackNavReverse := regexp.MustCompile(`(\.{2}\\)`) // ..\
	unixParentCatchAll := regexp.MustCompile(`(\.{2})`) // anything with two dots (.) next to each other
	//fileNameTerminate := regexp.MustCompile(`(%0{2}).+`) // %00 terminates a filename. EX. ?file=secret.doc%00.pdf would get: secret.doc NOT .pdf
	parentEncoding := regexp.MustCompile(`(?i)(\.{2}%c0%af)`) // ..%c0%af = ../
	parentEncodingReverse := regexp.MustCompile(`(?i)(\.{2}%c%9c)`) // ..%c1%9c = ..\
	// To test against encoding or double encoding, this will fail close, testing individual encoding characters rather than strings
	// since an attacker could use %2e%2e%2f = ../ OR ..%2f = ../ OR %2e%2e/ = ../ and so on
	dotEncode := regexp.MustCompile(`(?i)%2e`) // %2e = .
	dotDoubleEncode := regexp.MustCompile(`(?i)%252e`) // %252e = .
	slashEncode := regexp.MustCompile(`(?i)(%2f)`) // %2f = /
	slashDoubleEncode := regexp.MustCompile(`(?i)(%252F)`) // %252F = /
	backslashEncode := regexp.MustCompile(`(?i)(%5c)`) // %5c = \
	backslashDoubleEncode := regexp.MustCompile(`(?i)(%225c)`) // %225c = \

	badReturnMsg := "Suspected Path Traversal Attack. Aborted."

	testingArray := []bool{
		unixBackNav.MatchString(input),
		unixBackNavReverse.MatchString(input),
		unixParentCatchAll.MatchString(input),
		//fileNameTerminate.MatchString(input),
		parentEncoding.MatchString(input),
		parentEncodingReverse.MatchString(input),
		dotEncode.MatchString(input),
		dotDoubleEncode.MatchString(input),
		slashEncode.MatchString(input),
		slashDoubleEncode.MatchString(input),
		backslashEncode.MatchString(input),
		backslashDoubleEncode.MatchString(input),
	}

	for _, test := range testingArray {
		if test {
			return true, badReturnMsg
		}
	}
	return false, input
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

// WhichhStringInSlice is a simple methhod to implement JS Array.prototype.findIndex() which will also return -1 if not found
func WhichStringInSlice(a string, list []string) int {
	for i, b := range list {
		if b == a {
			return i
		}
	}
	return -1
}
