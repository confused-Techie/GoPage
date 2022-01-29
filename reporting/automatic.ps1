echo "Running automatic reports, and linting actions..."
# Determine many complexity reports of the JS
# npm install -g complexity-report
cr -o reporting/complexity-report-js.txt .

echo "Determined complexity reports for JavaScript..."

# npm install -g prettier
prettier --check -u -w .

echo "Finishing running prettier..."

# Format the Go Code using this formatter to be more readable
gofmt -s -w -e .

echo "Finished formatting Golang files..."

# Measures cyclomatic complexity of go functions
# go install github.com/fzipp/gocyclo/cmd/gocyclo@latest
gocyclo . | Out-File -FilePath reporting/cyclomatic-complexity-go.txt -Encoding ASCII

echo "Determined cyclomatic complexity reports for Golang..."

echo "Finished tasks."
