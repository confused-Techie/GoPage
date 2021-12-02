package apiFunc

import (
  "time"
  "net/http"
  )

var client = http.Client{
  Timeout: 2 * time.Second,
}

func Ping(domain string) (int, error) {
  req, err := http.NewRequest("HEAD", domain, nil)
  if err != nil {
    return 0, err
  }
  resp, err := client.Do(req)
  if err != nil {
    return 0, err
  }
  resp.Body.Close()
  return resp.StatusCode, nil
}
