## JavaScript API

Within the Global Scope of GoPage there is an API available for Plugins to extend functionality and allow easy access to likely reused features.

### Accessing API

The API available is all within the `pluginAPI` namespace and should be accessed like the following:
`pluginAPI.Function();`

### ReturnItems()

This endpoint expects to be provided your Plugin Name matching the `name` in your `package.json` file. And will return an HTML collection of all elements that use this plugin.

> Example

````(javascript)
var elements = pluginAPI.ReturnItems('statusCheck');

// Since the HTML Collection has no forEach Method, we will use a standard for loop
for (var i = 0; i < elements.length; i++) {
  console.log(elements[i]);
}
````

### ParseConfig()

This endpoint expects to be provided your Raw Configuration Settings and will parse them accordingly. Returning a JavaScript Object.
This Object will allow you to access your settings in the traditional way expected.

> Example

Lets take the following settings declared within your `package.json`

````(javascript)
"options": {
  "explain": "An array of accepted Status Codes. List of all Acceptable Status Codes within the brackets.",
  "autofill": "statusCodes=[200];"
},
````

The `autofill` section here defines the Settings or Config for your Plugin. And we can then use the ParseConfig like below, keep in mind this can only be done with one element.

````
var rawOptions = element.getAttribute('data-options');
var parseOptions = pluginAPI.ParseConfig(rawOptions);

var acceptedStatusCodes = parseOptions.statusCodes ? parseOptions.statusCodes : [200];
````
In the above we use the included Element's Data Attributes to retrieve the Options for this Element during creation, and we use `ParseConfig()` to turn the Raw Config into a JavaScript Object, and finally check that our specific Option is available against a Ternary Operator applying default settings if our specific option is not available. 
