# GoPage

>A simple Website Shortcut Dashboard written in Go.

[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse%20Performance%20-100%25-success)](#)
[![Lighthouse Accessibility](https://img.shields.io/badge/Lighthouse%20Accessibility-100%25-success)](#)
[![Lighthouse Best Practices](https://img.shields.io/badge/Lighthouse%20Best%20Practices-100%25-success)](#)
[![Lighthouse SEO](https://img.shields.io/badge/Lighthouse%20SEO-82%25-yellow)](#)
[![Lighthouse PWA](https://img.shields.io/badge/Lighthouse%20PWA-0%25-inactive)](#)

[![Go Report Card](https://goreportcard.com/badge/github.com/confused-Techie/GoPage)](https://goreportcard.com/report/github.com/confused-Techie/GoPage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/aaadbe13d42448a6b4a942be881544c3)](https://www.codacy.com/gh/confused-Techie/GoPage/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=confused-Techie/GoPage&amp;utm_campaign=Badge_Grade)
<img src="https://badgen.net/github/release/confused-Techie/GoPage">
<img src="https://badgen.net/github/license/confused-Techie/GoPage">
<img src="https://img.shields.io/github/last-commit/confused-Techie/GoPage">

GoPage has been made with the goal of extreme simplicity and convenient extensibility. Where standalone it's a simplistic way to store and manage Links to pages giving them unique user-defined categories, with easy ability to edit them down the line. And if you mix in the existing plugins and extreme ease of creating new ones gives life to these Links to show you the data needed at a moments glance.

![Example of GoPage HomePage](/docs/assets/homepage-utilized.png)
>An Image of GoPage with Plugins: Favicon Swiper, Status Check, Jellyfin API, Pihole API installed. With Custom Background set to [Lake - Desktop Background Wallpaper](https://www.flickr.com/photos/83646108@N00/3613708379) by [(matt)](https://www.flickr.com/photos/83646108@N00) licensed under [CC BY-ND 2.0](https://creativecommons.org/licenses/by-nd/2.0/?ref=openverse&atype=rich)

## Installation

### Docker

The installation for Docker should be universal for Linux, and Windows, taking only a few commands.

*  First just download the Container
*  And run it using whatever Port you prefer, giving a name if you'd like.

````(bash)
docker pull ghcr.io/confused-techie/gopage:0.3.1

docker run -p 7070:8080 --name GoPageServer ghcr.io/confused-techie/gopage:0.3.1
````

*  Please keep in mind the **7070** shown here can be whatever port you want the Docker Container Exposed on. Whereas **8080** is the default port the GoPage Server will listen to within the container.

### Windows

If you'd just like to give this a quick go or aren't a fan of Docker you can install the Windows Only Application in the releases Section. [V0.3.1 Available Here](https://github.com/confused-Techie/GoPage/releases/tag/v0.3.1)

*  Simply download the installer and run it, walking through the options it shows. Keep in mind the resulting application must be running in order for you to be able to connect to the GoPage Dashboard.

## First Time Configuration

Once you've installed GoPage Dashboard you will be able to navigate to it like so

````(bash)
http://SERVER-IP:PORT/
````

Once there you can get started by adding new Links by hitting 'Add New Item' and filling in the details on the next page.

*  Friendly Name: Will be the name shown to you when you look at this Link.
*  Link: Of Course is the actual Link to navigate to.
*  Category: Is if you so choose a Category you can create for this link, to later on help you find it again. This section will suggest any previously created categories but can always be something new.

If you haven't installed any plugins at this point you can ignore the different Plugin Sections and hit 'Submit'

Otherwise if you'd like to get started with some plugins to extend the functionality of GoPage you can navigate to Settings via the Gear Icon in the top left corner then hitting the GoTo button on the right side of the 'Plugin Repo' Listing under Tools.

Or by navigating to:

````
http://SERVER-IP:PORT/pluginrepo
````

Once here feel free to read through and explore the Plugins available and download them, which will then give you the ability to set them in the Plugin Fields of a New Link Item or while Editing a Link Item.

## Plugins Available by Default

Many Plugins have already been created for GoPage and are available by default after installation.

*  Status Check: Simple way to see if the address is currently reachable.
*  Favicon Swiper: Retrieve Favicons via known methods or Google API's as a fallback.
*  Jellyfin API: Get information about your Jellyfin Instance.
*  Pihole API: Get information from your Pihole Instance.
*  Light Theme: Simple Light Theme for those not loving the Dark Theme.
*  Exaggerator Theme: Exaggerator Theme... Just Colourful.

## [Contribute](docs/contribute.md)

## Learning More

### [Exploring GoPage](docs/exploringGopage.md)

### [Exploring Plugins](docs/exploringPlugins.md)

### [Creating Plugins](docs/createPlugins.md)
