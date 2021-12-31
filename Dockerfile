# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go

# Attempting to combine multiple RUN directives to reduce the amount of layers built
FROM golang:latest

# Specify the default destination for all other commands
WORKDIR /app

# Copy the local package files to the container's workspace
ADD . ./

# Build the gopage command inside the container
# And any dependencies
RUN go get github.com/spf13/viper && go install . && go build -o /gopage
# RUN go install .

# move the data file  from clean files to the root
COPY /cleanFiles/list.json /app/list.json

# Build the application
#RUN go build -o /gopage

# Run the gopage command by default when the container starts
#ENTRYPOINT /go/bin/gopage

# Document that the service listens on port 8080
EXPOSE 8080

# This tells docker what command to execute when our image is used to start a container
CMD [ "/gopage", "-docker=true" ]
