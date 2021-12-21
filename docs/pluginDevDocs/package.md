## Package.json

The `package.json` is what defines everything that appears within the Plugin Repo and will define all options settings and declarative information for your Plugin.

If you've used many other Node.js frameworks you should be familiar with this format. Although this does make some changes to the format and require some new options. An example of a valid `package.json` is below.

````
{
  "name": "statusCheck",
  "friendlyName": "Status Check",
  "version": "0.2",
  "description": "Simple way to see if the address is currently reachable.",
  "type": "item",
  "author": "confused-Techie",
  "license": "GPL-3.0",
  "infoLink": "https://github.com/confused-Techie/GoPage-Plugins",
  "downloadLink": "https://github.com/confused-Techie/GoPage-Plugins/releases/download/StatusCheckV0.2/StatusCheckV0.2.zip",
  "installed": false,
  "config": true,
  "mainDir": "/statusCheck/",
  "main": "main.js",
  "options": {
    "explain": "An array of accepted Status Codes. List of all Acceptible Status Codes within the brackets.",
    "autofill": "statusCodes=[200];"
  },
  "icon": {
    "available": true,
    "type": "raw",
    "style": "GreenCircle",
    "symbol": "Checkmark"
  }
}
````

Below each item within the `package.json` will be defined showing available settings.

### `name`

This will be the name used internally within GoPage. Its recommended that this matches exactly with the name of the parent folder your plugin exists in. This name will be used for [querying](javascriptapi.md) what Link Items are using your Plugin.

### `friendlyName`

This can be a space separated prettified version of your Plugin's Name, and will be shown when a user assigns your Plugin to a Link Item, and will be shown in the Plugin Repo as the Name of your Plugin.

### `version`

This can be the version of your plugin and is shown within the Plugin Repo.

### `description`

A friendly description of your Plugin used within the Plugin Repo.

### `type`

This is the Type of Plugin you are creating that has [specific options](types.md) available for use.

### `author`

Identifier of who created the Plugin which is shown within the Plugin Repo. this can contain multiple contributors as needed.

### `license`

The License of the source Code for your Plugin. Shows on the Plugin Repo.

### `infoLink`

Link available on the Plugin Repo to allow further information of your Plugin.

### `downloadLink`

The link that will be accessed when a user clicks to download your Plugin. Should be directly downloadable from there, and expects the Plugin as a Zip file.

### `installed`

This is used internally by GoPage and should always be set to false in the source code.

### `config`

A boolean value used to declare whether or not this Plugin has Settings available to change. and if set to `true` must then have an additional `options` section.

### `mainDir`

The name of the parent folder for your plugin. Should be enclosed in `\` to look like the following:
`"mainDir": "/statusCheck/"`

### `main`

The Name of the entry file for your Plugin. Appropriately pointing to the correct type of file based on [Plugin Type](types.md)

### `options`

This will be an object containing data for any options preset if `config: true`

  ##### `explain`

  This will be a friendly string that shows on the Edit/New Link Item Page to explain the settings available for your plugin to the user.

  ##### `autofill`

  This should be a specially crafted string to define the settings available for your option, that will then be immediately available to your plugin once attached to a Link Item.

  Ensure this follows the format of `optionName=OptionValue;optionNameTwo=OptionValueTwo;`

  > Example

  ````
  "autofill": "statusCodes=[200];"
  ````
  ````
  "autofill": "url=http://your-server:port;apiKey=yourKey;"
  ````

### `icon`

This will declare the Icon for your plugin that will show in the Plugin Repo. It allows for some basic styling of an Icon, or a URL can be specified that has an image available, or lastly any Image built into GoPage can be used for this.

But does contain some options to specify the above.

  ##### `available`

  Defines whether an Icon is available, a boolean value that if `false` can not include any of the following options, otherwise they are required.

  ##### `type`

  Specifies what type of Icon is available, meaning the choice between custom styling, or a URL or built in image.

  Valid Values:

  `image`: Meaning a URL or built in image.

  `raw`: Meaning custom styling.

  ##### `src`

  If your Icon Type is `image`, `src` can be used to specify the URL of the image. Simply use "/assets/images/..." to specify an image that's built into GoPage, or use a standard URL for any other image. 

  ##### `style`

  If your Icon Type is `raw`, `style` can declare an overall style of the Icon with the following Valid Values:

  `GreenCircle`: Would then draw an appropriately sized Green Circle around the Symbol chosen.

  ##### `symbol`

  If your Icon Type is `raw`, `symbol` can declare the symbol shown, within the Icon `style` if specified. With the following Valid Values:

  `Checkmark`: Would draw an appropriately sized Checkmark within your `style` element.
