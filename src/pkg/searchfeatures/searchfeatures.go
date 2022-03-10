package searchfeatures

import (
	"fmt"
	model "github.com/confused-Techie/GoPage/src/pkg/model"
	universalMethods "github.com/confused-Techie/GoPage/src/pkg/universalMethods"
	"strings"
	"time"
	"unicode"
)

type document struct {
	ID           int
	srcID        int
	FriendlyName string
	Link         string
	Category     string
	Dump         string
	Tokens       []string
}

type documentSlice struct {
	Docs []*document
}

type result struct {
	FriendlyName string
	Link         string
	Category     string
	Type         string
}

// ResultSlice is an array container of results, exported to make life easier.
type ResultSlice struct {
	Results []*result
}

var globalLinkItems documentSlice

// BuildIndex needs to be called before making any requests for data, as it will build the index of searchable data.
func BuildIndex() {
	start := time.Now()
	// build index instead will handle grabbing the data it needs.
	loadLinkItems()

	duration := time.Since(start)
	fmt.Println("Done Building Search Index in:", duration, "-", duration.Nanoseconds(), "ns")
}

// GetIndex just returns abitrary return data, intended to help test that the index has been initialized properly
func GetIndex() []string {
	return globalLinkItems.Docs[1].Tokens
}

// SearchIndexLinkItem takes a search string and returns matching result structs if any for the search
func SearchIndexLinkItem(search string) ResultSlice {
	start := time.Now()

	tokenSearch := stopwordFilter(lowercaseFilter(tokenize(search)))
	var res ResultSlice

	for _, itm := range globalLinkItems.Docs {
		for _, char := range tokenSearch {
			for _, token := range itm.Tokens {
				if strings.Contains(token, char) {
					fmt.Println("Match Found", itm.Dump, universalMethods.LogInjectionAvoidance(char))
					var tmpRes result
					tmpRes.FriendlyName = itm.FriendlyName
					tmpRes.Link = itm.Link
					tmpRes.Category = itm.Category
					tmpRes.Type = "link-item"
					res.Results = append(res.Results, &tmpRes)
				}
			}
		}
	}

	duration := time.Since(start)
	fmt.Println("Search Executed in:", duration, "-", duration.Nanoseconds(), "ns")
	return res
}

func loadLinkItems() {
	au := model.HomeV2()

	for i, itm := range au.Items {
		var tmpDoc document
		tmpDoc.FriendlyName = itm.FriendlyName
		tmpDoc.Link = itm.Link
		tmpDoc.Category = itm.Category
		tmpDoc.ID = i
		tmpDoc.srcID = itm.ID
		tmpDoc.Dump = createDataDump(itm.FriendlyName, itm.Link, itm.Category)
		tmpDoc.Tokens = stopwordFilter(lowercaseFilter(tokenize(tmpDoc.Dump)))
		globalLinkItems.Docs = append(globalLinkItems.Docs, &tmpDoc)
	}
	return
}

func createDataDump(text ...string) string {
	var result string

	for _, char := range text {
		result = result + char + " "
	}

	return result
}

func tokenize(text string) []string {
	return strings.FieldsFunc(text, func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsNumber(r)
	})
}

func lowercaseFilter(tokens []string) []string {
	r := make([]string, len(tokens))
	for i, token := range tokens {
		r[i] = strings.ToLower(token)
	}
	return r
}

func stopwordFilter(tokens []string) []string {
	var stopwords = map[string]struct{}{
		"https": {}, "com": {}, "http": {},
	}

	res := make([]string, 0, len(tokens))
	for _, token := range tokens {
		if _, ok := stopwords[token]; !ok {
			res = append(res, token)
		}
	}
	return res
}
