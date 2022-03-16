# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go

# Attempting to combine multiple RUN directives to reduce the amount of layers built
FROM golang:1.17

# Set up environment variables with defaults that can be replacing during docker run
ENV LANG="en"
ENV ROBOTS="private"
ENV LOGGING="custom"

# Specify the default destination for all other commands
WORKDIR /app

# Copy the local package files to the container's workspace
COPY . ./

# Build the gopage command inside the container
# And any dependencies
RUN go get github.com/spf13/viper && go install . && go build -o /gopage

# move the data file  from clean files to the root
COPY /cleanFiles/list.json /app/data/list.json
# Move the userSettings file from clean files to its proper location
COPY /cleanFiles/userSettings.json /app/data/userSettings.json

VOLUME /app/data

# Document that the service listens on port 8080
EXPOSE 8080

# This tells docker what command to execute when our image is used to start a container
# This had to be changed to invoke a shell to allow variable replacmeent, specifying a language
CMD [ "sh", "-c", "/gopage -docker=true -lang=$LANG -logging=$LOGGING -robots=$ROBOTS" ]
