package apiFunc

import (
  "testing"
  "os"
  "reflect"
)

func TestHostSettingGet(t *testing.T) {
  want, error := os.Hostname()
  if error != nil {
    t.Fatalf("HostSettingGet: expected: --, got: %v", error)
  }
  
  got, error := HostSettingGet()

  if error != nil {
    t.Fatalf("HostSettingGet: expected: %v, got: %v", want, error)
  }

  if !reflect.DeepEqual(want, got) {
    t.Fatalf("HostSettingGet: expected: %v, got: %v", want, got)
  }
}
