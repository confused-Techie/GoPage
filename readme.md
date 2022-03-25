# GoPage

>A simple Website Shortcut Dashboard written in Go.

[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse%20Performance%20-100%25-success)](#)
[![Lighthouse Accessibility](https://img.shields.io/badge/Lighthouse%20Accessibility-100%25-success)](#)
[![Lighthouse Best Practices](https://img.shields.io/badge/Lighthouse%20Best%20Practices-98.6%25-success)](#)
[![Lighthouse SEO](https://img.shields.io/badge/Lighthouse%20SEO-100%25-success)](#)
[![Lighthouse PWA](https://img.shields.io/badge/Lighthouse%20PWA-0%25-inactive)](#)

[![Go Report Card](https://goreportcard.com/badge/github.com/confused-Techie/GoPage)](https://goreportcard.com/report/github.com/confused-Techie/GoPage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/aaadbe13d42448a6b4a942be881544c3)](https://www.codacy.com/gh/confused-Techie/GoPage/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=confused-Techie/GoPage&amp;utm_campaign=Badge_Grade)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[![Latest Release](https://badgen.net/github/release/confused-Techie/GoPage)](https://github.com/confused-Techie/GoPage/releases/latest)
[![License](https://badgen.net/github/license/confused-Techie/GoPage)](https://github.com/confused-Techie/GoPage/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/confused-Techie/GoPage)](https://github.com/confused-Techie/GoPage/commits/main)

[![Crowdin](https://badges.crowdin.net/gopage/localized.svg)](https://crowdin.com/project/gopage)
[![Documentation](/docs/devDocs/badge.svg)](/docs/devDocs/JavaScript.md)

GoPage has been made with the goal of extreme simplicity and convenient extensibility. Where standalone it's a simplistic way to store and manage Links to pages giving them unique user-defined categories, with easy ability to edit them down the line. And if you mix in the existing plugins and extreme ease of creating new ones gives life to these Links to show you the data needed at a moments glance.

![Example of GoPage HomePage](/docs/assets/homepage-utilized-0.5.png)
>An Image of GoPage Version 0.5 with Plugins: Favicon Swiper, Status Check, Jellyfin API, Pihole API, AQI Current, Self Hosted Icons installed.

![GoPage Link Item Closeup](/docs/assets/link-item-closeup-0.5.gif)
>Closeup of GoPage Link Item pointing at a Jellyfin Self Hosted Instance. Using Plugins Favicon Swiper, Status Check, Jellyfin API.

![GoPage Searchbar Closeup](/docs/assets/searchbar-0.5.gif)
>Closeup of GoPage Searchbar demonstrating the fast and effective search for finding any saved Link Items. Showing Plugins: AQI Current, Self Hosted Icons, Jellyfin API, Favicon Swiper, Status Check.

## Features

* Install many plugins to expand the functionality of a saved Link Item.
* Custom User-Defined categories for each Link Item.
* Custom Background Images.
* Searchable saved Link Items.
* Filter saved Link Item based on the category.
* Link Health page to alert of Link Items with duplicate Links or matching Hostnames.
* Each Link Item can have a custom colour, or different style applied.
* Supports many types of HTTP logging, to assist in log aggregation.
* Supports either private or public Robots file to prevent or encourage appearing in search engines.
* GoPage supports many different languages, with contributions always welcome to improve them.
  * Arabic
  * Chinese (Traditional)
  * English
  * French
  * German
  * Japanese
  * Korean
  * Russian
  * Spanish (Mexico)

## Plugins Available

Many Plugins have already been created for GoPage and are available by default after installation.

  * Status Check: Simple way to see if the address is currently reachable.
  * Favicon Swiper: Retrieve Favicons via known methods or Google API's as a fallback.
  * Jellyfin API: Get information about your Jellyfin Instance.
  * Pihole API: Get information from your Pihole Instance.
  * Light Theme: Simple Light Theme for those not loving the Dark Theme.
  * Exaggerator Theme: Exaggerator Theme... Just Colourful.
  * AQI Current: Get Air Quality Information at a glance. Via AirNow.gov.
  * Self Hosted Icons: Get self Hosted High Quality Icons alongside their links.
  * Dev Service Icons: Devicons Wrapper for GoPage Link Items.

## Installation

### Docker

The installation for Docker should be universal for Linux, and Windows, taking only a few commands.

* First download the Docker Image.
````(bash)
docker pull ghcr.io/confused-techie/gopage:0.5.2
````

* Then you will need to create a Named Docker Volume. This allows data to persist during updates.
  * Saving all your Link Items and their associated data.
  * Installed Plugins, and currently available Plugins. (But the 'Update Available Plugins' Button on the Plugin Repo will successfully update the available Plugins)
  * User Settings: Background Image, Header Plugins.

````(bash)
docker volume create --name GoPageV
````

* Finally with the Named Docker Volume created, and Image downloaded, we can run the Image.

````(bash)
docker run -it -p 7070:8080 --name GoPage -v GoPageV:/app/data ghcr.io/confused-techie/gopage:0.5.2
````

When running the container, the above is all that's required, but there are many more options that can be set during this process.

And for testing purposes the Named Volume can be excluded but your data will not persist updates or removal of the Container.

  * `-v GoPageV:/app/data` The Named Volume here should be whatever you created yours as during `docker volume create --name --`
  * `-it` Ensures to detach the shell allowing you to retain control of the TTY shell easily. Since in some circumstances SIGTERM may not be passed appropriately to the right context.
  * Please keep in mind the **7070** shown here can be whatever port you want the Docker Container Exposed on. Whereas **8080** is the default port the GoPage Server will listen to within the container.
  * GoPage supports additional variables that can be set. [Please refer to the documentation](docs/docker-environmentVariables.md).


### Windows

If you'd just like to give this a quick go or aren't a fan of Docker you can install the Windows Only Application in the releases Section. [V0.4 Available Here](https://github.com/confused-Techie/GoPage/releases/tag/v0.4)

  * Simply download the installer and run it, walking through the options it shows. Keep in mind the resulting application must be running in order for you to be able to connect to the GoPage Dashboard.

## First Time Configuration

Once you've installed GoPage Dashboard you will be able to navigate to it like so

````(bash)
http://SERVER-IP:PORT/
````

If you haven't added any Link Items to GoPage you'll be greeted by the 'First Time Setup' window, helping with tips similar to whats found here. Otherwise feel free to give this a look over.

Once there you can get started by adding new Links by hitting 'Add New Item' and filling in the details on the next page.

  * Friendly Name: Will be the name shown to you when you look at this Link.
  * Link: Of Course is the actual Link to navigate to.
  * Category: Is if you so choose a Category you can create for this link, to later on help you find it again. This section will suggest any previously created categories but can always be something new.

If you haven't installed any plugins at this point you can ignore the 'Add Plugin' button and hit 'Submit'

Otherwise if you'd like to get started with some plugins to extend the functionality of GoPage you can click 'Plugin Repo' in the top Header.

Or by navigating to:

````
http://SERVER-IP:PORT/pluginrepo
````

Once here feel free to read through and explore the Plugins available and download them, which will then give you the ability to set them in the Plugin Fields of a New Link Item or while Editing a Link Item.

## [Contribute](docs/CONTRIBUTING.md)

## Learning More

### [Exploring GoPage](docs/exploringGopage.md)

### [Exploring Plugins](docs/exploringPlugins.md)

### [Creating Plugins](docs/createPlugins.md)
