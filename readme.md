# GoPage

>A simple Website Shortcut Dashboard written in Go.

GoPage has been made with the goal of extreme simplicity and convenient extensibility. Where standalone it's a simplistic way to store and manage Links to pages giving them unique user-defined categories, with easy ability to edit them down the line. And if you mix in the existing plugins and extreme ease of creating new ones gives life to these Links to show you the data needed at a moments glance.

## Installation

### Docker

The installation for Docker should be universal for Linux, and Windows, taking only a few commands.

* First just download the Container
* And run it using whatever Port you prefer, giving a name if you'd like.

````(bash)
docker pull ghcr.io/confused-techie/gopage:0.1

docker run -p 7070:8080 --name GoPageServer ghcr.io/confused-techie/gopage:0.1
````

* Please keep in mind the **7070** shown here can be whatever port you want the Docker Container Exposed on. Whereas **8080** is the default port the GoPage Server will listen to within the container.

### Windows

If you'd just like to give this a quick go or aren't a fan of Docker you can install the Windows Only Application in the releases Section. [V0.1 Available Here](https://github.com/confused-Techie/GoPage/releases/tag/beta)

* Simply download the installer and run it, walking through the options it shows. Keep in mind the resulting application must be running in order for you to be able to connect to the GoPage Dashboard.

## First Time Configuration

Once you've installed GoPage Dashboard you will be able to navigate to it like so

````
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

## [Contribute](docs/contribute.md)

## Learning More

### [Exploring GoPage](docs/exploringGopage.md)

### [Exploring Plugins](docs/exploringPlugins.md)

### [Creating Plugins](docs/createPlugins.md)
