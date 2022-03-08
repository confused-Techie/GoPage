package universalMethods

import (
	"regexp"
	"testing"
)

func TestLogInjectionAvoidance(t *testing.T) {
	type test struct {
		name string
		input string
		want string
	}

	tests := []test{
		{ name: "SafeInput", input: "Hello World Safe", want: "Hello World Safe"},
		{ name: "UnsafeInput(rn)", input: "Hello World Unsafe\r\n", want: "Hello World Unsafe"},
	}

	for _, tc := range tests {
		// Using t.Run for allow for verbose subtests 
		t.Run(tc.name, func(t *testing.T) {
			want := regexp.MustCompile(tc.want)
			msg := LogInjectionAvoidance(tc.input)
			if !want.MatchString(msg) {
				t.Fatalf("%s: Expected: %v, Got: %v", tc.name, tc.want, msg)
			}
		})
	}
}
