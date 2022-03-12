## Docker Environment Variables

### Language

The language can be set to any language supported by GoPage via the Docker Environment Variable. Feel free to refer to the [Readme](readme.md) for further details on supported languages.

This Environment Variable is accessed via `LANG`.

`Defaults: en`

* For Example:
````
docker run -p 7070:8080 --name GoPage -e LANG="en" ghcr.io/confused-techie/gopage:VERSION
````

When setting a language ensure to use the [ISO 639-1 two character language abbreviation.](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

Supported Languages:
* Arabic - [ar]
* Chinese (Traditional) - [zh]
* English - [en]
* French - [fr]
* German - [de]
* Japanese - [ja]
* Korean - [ko]
* Russian - [ru]
* Spanish (Mexico) - [es]

### Logging

The HTTP Logging Format can be set to a few different options to assist in aggregation of log data.

`Defaults: custom`

* For Example:
````
docker run -p 7070:8080 --name GoPage -e LOGGING="custom" ghcr.io/confused-techie/gopage:VERSION
````

Supported Logging Formats:
* Combined - [ "combined" ]
* Common - [ "common" ]
* custom - [ "custom" ]

The Custom format is my personal favourite and not an otherwise standardized format.

Outputting data in the following format:

````
DATE TIME 'HTTP-METHOD URI IPADDRESS HTTP-STATUS-CODE BYTES-TRANSFERED TIME-TAKEN'
2022/03/11 18:55:32 'GET /' from [::1]:1054 - 200 38368B in 1.4998ms
````

### Robots

The Robots file can be set to either Private or Public, disallowing Search Engine Bot Crawling website wide, or allowing it website wide.

`Defaults: private`

* For Example:
````
docker run -p 7070:8080 --name GoPage -e ROBOTS="private" ghcr.io/confused-techie/gopage:VERSION
````

Supported Options:
* Private - [ "private" ]
* Public - [ "public" ]
