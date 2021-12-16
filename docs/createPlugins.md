# Creating Plugins

GoPage attempts to make creating Plugins incredibly easy, to allow an ecosystem of plugins to quickly and robustly as possible.

## Getting Started

In time hopefully there will be a full guide on creating a new plugin below. But until there many questions could be answered by taking a look at the first party plugins created for GoPage. Hosted on [Github](https://github.com/confused-Techie/GoPage-Plugins)

## Overview

The two major components of any GoPage Plugin will be the `package.json` and the file designated as `main` likely being a `Javascript` file.

* Package.json

  The Package file like many other repos will contain declarative and functional information for your plugin. Ranging from the License and Version, to the available Options, and Entrypoint.

  The bare minimuim of a functional Package File will contain the following:

  * mainDir: This is the parent folder for your plugin, which is strongly recommended to be identical to your name value of your plugin.

  * main: This is the file that will be loaded by GoPage for your plugin to function. The type of file this should be pointing to will depend on what type of Plugin it is. But generally will be a  `Javascript` file.

  * type: The declaration of what type of Plugin yours is.

Within your Main file of the Plugin there are Data Attributes attached to the Link Item Element attached to your plugin that can be queried to retrieve data needed for your Plugin, like Options and the URL of the Link Item.

As well within your Main file you will be able to use JavaScript API's for additional functionality, or if needed HTTP API endpoints within the GoPage Backend for functionality that is difficult or impossible to achieve in JavaScript.

## Plugin Documentation

### Package.json

Further information on creating a `package.json` file can be found [here](/pluginDevDocs/package.md).

### Plugin Types

Further information on declaration of usage of different Plugin Types can be found [here](/pluginDevDocs/types.md).

### JavaScript API

Further information on availability and functionality of JavaScript API's can be found [here](/pluginDevDocs/javascriptapi.md).

### API Endpoints

Further information on the availability and functionality of the GoPage Backend Server API Endpoints can be found [here](/pluginDevDocs/apiendpoints.md).
