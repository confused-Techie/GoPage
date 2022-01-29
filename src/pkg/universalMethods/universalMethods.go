package universalMethods

import (
	"strings"
)

// LogInjectionAvoidance will do basic sanitization of strings before being put into the log
func LogInjectionAvoidance(input string) string {
	// This will attempt to sanitize input that will be written to logs
	escapedInput := strings.Replace(input, "\n", "", -1)
	escapedInput = strings.Replace(escapedInput, "\r", "", -1)
	return escapedInput
}
