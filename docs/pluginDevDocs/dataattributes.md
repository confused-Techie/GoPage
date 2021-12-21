## Data Attributes

On each Link Item there will be a few Data Attributes available to obtain data needed for each plugin.

### Accessing Attributes

Once you have the Element of a Link Item, which can be easily obtained using the [`ReturnItems()`](javascriptapi.md) API Endpoint, the `getAttribute()` method of an Element interface can be used to return the value.

````(javascript)
var elements = pluginAPI.ReturnItems('statusCheck');

for (var i = 0; i < elements.length; i++) {
  var itemURL = elements[i].getAttribute('data-url');
}
````

### URL

Every single Link Item will contain `data-url` to allow a Plugin to obtain the URL that a Link Item points to.

````(javascript)
var itemURL = element.getAttribute('data-url');
````

### Options

If your `package.json` declares the `config` option as `true` then an Options Data Attribute is created with whatever config is saved for the Link Item.

````(javascript)
var rawOptions = element.getAttribute('data-options');
````
