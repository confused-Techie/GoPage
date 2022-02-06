package universalMethods

import (
	"regexp"
	"testing"
)

func TestLogInjectionAvoidanceSafe(t *testing.T) {
	data := "Hello World Safe"
	want := regexp.MustCompile(data)
	msg := LogInjectionAvoidance(data)
	if !want.MatchString(msg) {
		t.Fatalf(`LogInjectionAvoidance("Hello World Safe") = %q, want %v, nil`, msg, want)
	}
}

func TestLogInjectionAvoidanceUnsafe(t *testing.T) {
	data := "Hello World Unsafe\r\n"
	want := regexp.MustCompile("^(Hello World Unsafe)$")
	msg := LogInjectionAvoidance(data)
	if !want.MatchString(msg) {
		t.Fatalf(`LogInjectionAvoidance("Hello World Unsafe\r\n") = %q, want %v, nil`, msg, want)
	}
}
