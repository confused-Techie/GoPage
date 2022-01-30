# Determine many complixty reports of the JS
# npm install -g complexity-report
cr --config .complexrc .

# Measure cyclomatic complexity of go functions
# go install github.com/fzipp/gocyclo/cmd/gocyclo@latest
gocyclo . | Out-File -FilePath reporting/cyclomatic-complexity-go.txt -Encoding ASCII
