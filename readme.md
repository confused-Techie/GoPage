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
![zh-TW translation](https://img.shields.io/badge/dynamic/json?color=blue&label=zh-TW&style=flat&query=%24.progress.7.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)
![es-MX translation](https://img.shields.io/badge/dynamic/json?color=blue&label=es-MX&style=flat&query=%24.progress.2.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)
![ar translation](https://img.shields.io/badge/dynamic/json?color=blue&label=ar&style=flat&query=%24.progress.0.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)
![de translation](https://img.shields.io/badge/dynamic/json?color=blue&label=de&style=flat&query=%24.progress.1.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)
![fr translation](https://img.shields.io/badge/dynamic/json?color=blue&label=fr&style=flat&query=%24.progress.3.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)
![ja translation](https://img.shields.io/badge/dynamic/json?color=blue&label=ja&style=flat&query=%24.progress.4.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)
![ko translation](https://img.shields.io/badge/dynamic/json?color=blue&label=ko&style=flat&query=%24.progress.5.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)
![ru translation](https://img.shields.io/badge/dynamic/json?color=blue&label=ru&style=flat&query=%24.progress.6.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15135739-498245.json)

GoPage has been made with the goal of extreme simplicity and convenient extensibility. Where standalone it's a simplistic way to store and manage Links to pages giving them unique user-defined categories, with easy ability to edit them down the line. And if you mix in the existing plugins and extreme ease of creating new ones gives life to these Links to show you the data needed at a moments glance.

![Example of GoPage HomePage](/docs/assets/homepage-utilized-0.4.png)
>An Image of GoPage Version 0.4 with Plugins: Favicon Swiper, Status Check, Jellyfin API, Pihole API, AQI Current installed.

![GoPage Link Item Closeup](/docs/assets/link-item-closeup-0.4.gif)
>Closeup of GoPage Link Item pointing at a Jellyfin Self Hosted Instance. Using Plugins Favicon Swiper, Status Check, Jellyfin API.

## Features

* Full Theme Support from Installed Plugins
* Custom Background Images
* Plugin Repo Page:
  * Ability to update Available Plugins
  * Install/Uninstall Existing Plugins
* Link Health Page:
  * Alerts of Exact Duplicate Links
  * Alerts of Hostname Duplicate Links
* GoPage has full support for translations, but does need additional contributions to support more languages.
  * English: 100%
  * Spanish: 100%
  * Chinese Traditional: 100%

![Translations Progress](https://badges.awesome-crowdin.com/translation-15135739-498245.png)

## Installation

### Docker

The installation for Docker should be universal for Linux, and Windows, taking only a few commands.

  * First just download the Container
  * And run it using whatever Port you prefer, giving a name if you'd like, optionally setting the language.

````(bash)
docker pull ghcr.io/confused-techie/gopage:0.4

docker run -p 7070:8080 -e LANG="en" --name GoPageServer ghcr.io/confused-techie/gopage:0.4
````

  * Please keep in mind the **7070** shown here can be whatever port you want the Docker Container Exposed on. Whereas **8080** is the default port the GoPage Server will listen to within the container.

  * The `LANG` option is to set the GoPage Server Language. Ensuring to use the [ISO 639-1 two character language abbreviation.](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

### Windows

If you'd just like to give this a quick go or aren't a fan of Docker you can install the Windows Only Application in the releases Section. [V0.4 Available Here](https://github.com/confused-Techie/GoPage/releases/tag/v0.4)

  * Simply download the installer and run it, walking through the options it shows. Keep in mind the resulting application must be running in order for you to be able to connect to the GoPage Dashboard.

## First Time Configuration

Once you've installed GoPage Dashboard you will be able to navigate to it like so

````(bash)
http://SERVER-IP:PORT/
````

Once there you can get started by adding new Links by hitting 'Add New Item' and filling in the details on the next page.

  * Friendly Name: Will be the name shown to you when you look at this Link.
  * Link: Of Course is the actual Link to navigate to.
  * Category: Is if you so choose a Category you can create for this link, to later on help you find it again. This section will suggest any previously created categories but can always be something new.

If you haven't installed any plugins at this point you can ignore the different Plugin Sections and hit 'Submit'

Otherwise if you'd like to get started with some plugins to extend the functionality of GoPage you can navigate to Settings via the Gear Icon in the top left corner then hitting the GoTo button on the right side of the 'Plugin Repo' Listing under Tools.

Or by navigating to:

````
http://SERVER-IP:PORT/pluginrepo
````

Once here feel free to read through and explore the Plugins available and download them, which will then give you the ability to set them in the Plugin Fields of a New Link Item or while Editing a Link Item.

## Plugins Available by Default

Many Plugins have already been created for GoPage and are available by default after installation.

  * Status Check: Simple way to see if the address is currently reachable.
  * Favicon Swiper: Retrieve Favicons via known methods or Google API's as a fallback.
  * Jellyfin API: Get information about your Jellyfin Instance.
  * Pihole API: Get information from your Pihole Instance.
  * Light Theme: Simple Light Theme for those not loving the Dark Theme.
  * Exaggerator Theme: Exaggerator Theme... Just Colourful.
  * AQI Current: Get Air Quality Information at a glance. Via AirNow.gov.

## [Contribute](docs/contribute.md)

## Learning More

### [Exploring GoPage](docs/exploringGopage.md)

### [Exploring Plugins](docs/exploringPlugins.md)

### [Creating Plugins](docs/createPlugins.md)
