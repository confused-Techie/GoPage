# Determine many complexity reports of the JS
# npm install -g complexity-report
cr -o reporting/complexity-report-js.txt .

# Format the Go Code using this formatter to be more readable
gofmt -s -w -e .

# Measures cyclomatic complexity of go functions
# go install github.com/fzipp/gocyclo/cmd/gocyclo@latest
gocyclo . | Out-File -FilePath reporting/cyclomatic-complexity-go.txt -Encoding ASCII
