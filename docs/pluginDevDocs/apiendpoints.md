## API Endpoints

Within GoPage there are API Endpoints available for requests that cannot be accomplished within JavaScript simply.

### /api/ping

This API Endpoint expects the URL parameter `url` to specify the URL to ping.

When provided with a proper URL to ping against will return a JSON encoded value of the Status Code.

> Example

````(javascript)
var itemURL = element.getAttribute('data-url');

fetch(`/api/ping?url=${itemURL}`)
  .then(response => response.json())
  .then(data => {
    console.log(`Resulting Status Code: ${data}`);
    });
`````

### /api/serversettings

While this Endpoint is mainly used internally for GoPage, it's being included since it can provide some helpful information, mainly the chosen language of the Server.

Querying this endpoint will return a JSON Object of Server Settings as JSON.

The Data returned will be similar to this format but is subject to change as development continues. This format is current as of GoPage Version 0.2

````
{
  "name": "GoPage",
  "version": "0.2",
  "author": "confused-Techie",
  "lang": "en"
}
````

The language value displayed should match the ISO 639-1 language classification. And unless implemented otherwise can be used for plugins that need to display words to the user to translate properly. 
