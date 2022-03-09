## Members

<dl>
<dt><a href="#PluginHandlerJS">PluginHandlerJS</a> : <code>File</code></dt>
<dd><p>The JavaScript file to assist installed Plugins</p>
</dd>
<dt><a href="#PluginLoadJS">PluginLoadJS</a> : <code>File</code></dt>
<dd><p>The JavaScript file that handles loading Plugin Scripts on page load.</p>
</dd>
<dt><a href="#SettingsJS">SettingsJS</a> : <code>File</code></dt>
<dd><p>The JavaScript file loaded with the Settings Page</p>
</dd>
<dt><a href="#UniversalJS">UniversalJS</a> : <code>File</code></dt>
<dd><p>JavaScript file loaded with every single page for Universal Functions</p>
</dd>
<dt><a href="#UniverseJS">UniverseJS</a> : <code>File</code></dt>
<dd><p>Namespace of functions for easy access to repeatable actions.</p>
</dd>
<dt><a href="#UploadImageJS">UploadImageJS</a> : <code>File</code></dt>
<dd><p>The JavaScript file loaded with the Upload Image Page.</p>
</dd>
</dl>

<a name="PluginHandlerJS"></a>

## PluginHandlerJS : <code>File</code>
The JavaScript file to assist installed Plugins

**Kind**: global variable  

* [PluginHandlerJS](#PluginHandlerJS) : <code>File</code>
    * [.pluginAPI](#PluginHandlerJS.pluginAPI) : <code>object</code>
        * [.ReturnItems(pluginName)](#PluginHandlerJS.pluginAPI.ReturnItems) ⇒ <code>Array.HTMLCollection</code>
        * [.ParseConfig(rawConfig)](#PluginHandlerJS.pluginAPI.ParseConfig) ⇒ <code>Object</code>

<a name="PluginHandlerJS.pluginAPI"></a>

### PluginHandlerJS.pluginAPI : <code>object</code>
The namespace to access all PluginHandler internal functions

**Kind**: static namespace of [<code>PluginHandlerJS</code>](#PluginHandlerJS)  

* [.pluginAPI](#PluginHandlerJS.pluginAPI) : <code>object</code>
    * [.ReturnItems(pluginName)](#PluginHandlerJS.pluginAPI.ReturnItems) ⇒ <code>Array.HTMLCollection</code>
    * [.ParseConfig(rawConfig)](#PluginHandlerJS.pluginAPI.ParseConfig) ⇒ <code>Object</code>

<a name="PluginHandlerJS.pluginAPI.ReturnItems"></a>

#### pluginAPI.ReturnItems(pluginName) ⇒ <code>Array.HTMLCollection</code>
Returns a live HTMLCollection that use the specified plugin.

**Kind**: static method of [<code>pluginAPI</code>](#PluginHandlerJS.pluginAPI)  
**Returns**: <code>Array.HTMLCollection</code> - Live array of the DOM Element using the plugin.  

| Param | Type | Description |
| --- | --- | --- |
| pluginName | <code>string</code> | is the name of the Plugin to search for. |

<a name="PluginHandlerJS.pluginAPI.ParseConfig"></a>

#### pluginAPI.ParseConfig(rawConfig) ⇒ <code>Object</code>
Parses saved configuration data for plugins.

**Kind**: static method of [<code>pluginAPI</code>](#PluginHandlerJS.pluginAPI)  
**Returns**: <code>Object</code> - A Parsed JSON Object of the configuration data.  

| Param | Type | Description |
| --- | --- | --- |
| rawConfig | <code>string</code> | takes the raw string confiuration data. |

<a name="PluginLoadJS"></a>

## PluginLoadJS : <code>File</code>
The JavaScript file that handles loading Plugin Scripts on page load.

**Kind**: global variable  
<a name="SettingsJS"></a>

## SettingsJS : <code>File</code>
The JavaScript file loaded with the Settings Page

**Kind**: global variable  

* [SettingsJS](#SettingsJS) : <code>File</code>
    * [.onclickHandlers()](#SettingsJS.onclickHandlers)
    * [.removeHeaderPlugin(side)](#SettingsJS.removeHeaderPlugin)
    * [.changeOptionsAPI(item, value)](#SettingsJS.changeOptionsAPI)
    * [.doesJSONParse(data)](#SettingsJS.doesJSONParse) ⇒ <code>boolean</code>

<a name="SettingsJS.onclickHandlers"></a>

### SettingsJS.onclickHandlers()
Registers `onclick` handlers wherever relavent within the page.

**Kind**: static method of [<code>SettingsJS</code>](#SettingsJS)  
**Implements**: <code>universe.SnackbarCommon()</code>, <code>langHandler.UnicornComposite()</code>, <code>removeHeaderPlugin()</code>, <code>changeOptionsAPI()</code>  
<a name="SettingsJS.removeHeaderPlugin"></a>

### SettingsJS.removeHeaderPlugin(side)
Simplifies removing a Header Plugin from User Settings using GoPage APIs

**Kind**: static method of [<code>SettingsJS</code>](#SettingsJS)  
**Implements**: <code>universe.CreateJSONPOSTHeaders()</code>, <code>universe.SnackbarCommon()</code>, <code>langHandler.UnicornComposite()</code>, <code>universe.SnackbarError()</code>  

| Param | Type | Description |
| --- | --- | --- |
| side | <code>string</code> | Indicates the which Side the Header Plugin is being removed from. Valid Values: "right", "left" |

<a name="SettingsJS.changeOptionsAPI"></a>

### SettingsJS.changeOptionsAPI(item, value)
Simplified method of making API Calls to GoPage API to change user settings.

**Kind**: static method of [<code>SettingsJS</code>](#SettingsJS)  
**Implements**: <code>doesJSONParse()</code>, <code>universe.SnackbarError()</code>, <code>universe.SnackbarCommon()</code>, <code>langHandler.UnicornComposite()</code>  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>string</code> | The Identifier of the Item being changed. |
| value | <code>string</code> | The Value said Identifier is being changed to. |

<a name="SettingsJS.doesJSONParse"></a>

### SettingsJS.doesJSONParse(data) ⇒ <code>boolean</code>
Method of checking if passed data will parse into JSON without any errors.

**Kind**: static method of [<code>SettingsJS</code>](#SettingsJS)  
**Returns**: <code>boolean</code> - True if successfully parsed, false if it fails to parse.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | The data to test against. |

<a name="UniversalJS"></a>

## UniversalJS : <code>File</code>
JavaScript file loaded with every single page for Universal Functions

**Kind**: global variable  

* [UniversalJS](#UniversalJS) : <code>File</code>
    * [.loadTimeStamp()](#UniversalJS.loadTimeStamp)
    * [.updaterTimeStamp()](#UniversalJS.updaterTimeStamp)
    * [.checkCustomBackgroundImage()](#UniversalJS.checkCustomBackgroundImage)

<a name="UniversalJS.loadTimeStamp"></a>

### UniversalJS.loadTimeStamp()
Loads the TimeStamp and modifies the HTML to reflect the current time.

**Kind**: static method of [<code>UniversalJS</code>](#UniversalJS)  
<a name="UniversalJS.updaterTimeStamp"></a>

### UniversalJS.updaterTimeStamp()
Uses `setInterval` to call `loadTimeStamp()` every 1000 milliseconds (1 Second)

**Kind**: static method of [<code>UniversalJS</code>](#UniversalJS)  
**Implements**: <code>loadTimeStamp()</code>  
<a name="UniversalJS.checkCustomBackgroundImage"></a>

### UniversalJS.checkCustomBackgroundImage()
Queries GoPage APIs to determine and set a background image if needed, injecting it into the DOM.

**Kind**: static method of [<code>UniversalJS</code>](#UniversalJS)  
<a name="UniverseJS"></a>

## UniverseJS : <code>File</code>
Namespace of functions for easy access to repeatable actions.

**Kind**: global variable  

* [UniverseJS](#UniverseJS) : <code>File</code>
    * [.universe](#UniverseJS.universe) : <code>object</code>
        * [.SnackbarCommon(id, textToShow, [callback], [extraClass], [img], [alt], [additionalDetails])](#UniverseJS.universe.SnackbarCommon)
        * [.SnackbarError(id, textToShow, [callback], [details])](#UniverseJS.universe.SnackbarError)
        * [.ReloadCallback()](#UniverseJS.universe.ReloadCallback) ⇒ <code>function</code>
        * [.CreateJSONPOSTHeaders(data)](#UniverseJS.universe.CreateJSONPOSTHeaders) ⇒ <code>Object</code>
        * [.ShowModal(id)](#UniverseJS.universe.ShowModal)
        * [.CloseModal(id)](#UniverseJS.universe.CloseModal)
        * [.ShowTemplateModal(text)](#UniverseJS.universe.ShowTemplateModal)
        * [.WriteUserSettings(requestOptions, successCallback, errorCallback)](#UniverseJS.universe.WriteUserSettings)
        * [.GenericErrorHandler(snackbar, msg)](#UniverseJS.universe.GenericErrorHandler)
        * [.FindReturnsString(action, status)](#UniverseJS.universe.FindReturnsString) ⇒ <code>string</code>
        * [.HotReload(elementID, url, callback, callbackArg)](#UniverseJS.universe.HotReload)
        * [.Loader(shouldShow)](#UniverseJS.universe.Loader)

<a name="UniverseJS.universe"></a>

### UniverseJS.universe : <code>object</code>
The namespace to access all internal functions.

**Kind**: static namespace of [<code>UniverseJS</code>](#UniverseJS)  

* [.universe](#UniverseJS.universe) : <code>object</code>
    * [.SnackbarCommon(id, textToShow, [callback], [extraClass], [img], [alt], [additionalDetails])](#UniverseJS.universe.SnackbarCommon)
    * [.SnackbarError(id, textToShow, [callback], [details])](#UniverseJS.universe.SnackbarError)
    * [.ReloadCallback()](#UniverseJS.universe.ReloadCallback) ⇒ <code>function</code>
    * [.CreateJSONPOSTHeaders(data)](#UniverseJS.universe.CreateJSONPOSTHeaders) ⇒ <code>Object</code>
    * [.ShowModal(id)](#UniverseJS.universe.ShowModal)
    * [.CloseModal(id)](#UniverseJS.universe.CloseModal)
    * [.ShowTemplateModal(text)](#UniverseJS.universe.ShowTemplateModal)
    * [.WriteUserSettings(requestOptions, successCallback, errorCallback)](#UniverseJS.universe.WriteUserSettings)
    * [.GenericErrorHandler(snackbar, msg)](#UniverseJS.universe.GenericErrorHandler)
    * [.FindReturnsString(action, status)](#UniverseJS.universe.FindReturnsString) ⇒ <code>string</code>
    * [.HotReload(elementID, url, callback, callbackArg)](#UniverseJS.universe.HotReload)
    * [.Loader(shouldShow)](#UniverseJS.universe.Loader)

<a name="UniverseJS.universe.SnackbarCommon"></a>

#### universe.SnackbarCommon(id, textToShow, [callback], [extraClass], [img], [alt], [additionalDetails])
Common method for creating Snackbars onscreen, usually not directly accessed, instead accessed through a higher level function.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
**Implements**: <code>ShowTemplateModal()</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Div ID of the Snackbar to target. |
| textToShow | <code>string</code> | The Text that will appear within the Snackbar. |
| [callback] | <code>function</code> | Optional function to execute after the Snackbar has disappeared. |
| [extraClass] | <code>string</code> | Optional className to provide. Not needed to be set when accessing from a higher function. |
| [img] | <code>string</code> | Optional Relative path to an Image Icon to display alongside the text. |
| [alt] | <code>string</code> | Optional ALT tag for the Image thats being displayed. |
| [additionalDetails] | <code>string</code> | Optional details that will show in a modal if the Snackbar image is clicked. Setting additional details also makes the Snackbar Image clickable. |

**Example**  
```js
universe.SnackbarCommon("homePageSnackbar", "Success", universe.ReloadCallback());
```
**Example** *(A More Complex Example)*  
```js
universe.SnackbarCommon(
  "snackbar",
  langHandler.UnicornComposite(string, i18n_returnValueLinkItem),
  universe.HotReload("linkItemList", "/", homePageInit, "reload")
  );
```
<a name="UniverseJS.universe.SnackbarError"></a>

#### universe.SnackbarError(id, textToShow, [callback], [details])
Simple way to create an Error Snackbar, defaulting many values passed to SnackbarCommon.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
**Implements**: <code>SnackbarCommon()</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Div ID of Snackbar to target. |
| textToShow | <code>string</code> | The Text that will appear within the Snackbar. |
| [callback] | <code>function</code> | Optional function to execute after the Snackbar has disappeared. |
| [details] | <code>string</code> | Optional details that will show in a modal if the Snackbar Image is clicked. |

<a name="UniverseJS.universe.ReloadCallback"></a>

#### universe.ReloadCallback() ⇒ <code>function</code>
Provides a simple way to reload the page within callbacks. Since the standard `location.reload()` losses scope inside a callback.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
**Returns**: <code>function</code> - Globally Scoped function to reload page: `window.location.reload.bind(window.location)`  
<a name="UniverseJS.universe.CreateJSONPOSTHeaders"></a>

#### universe.CreateJSONPOSTHeaders(data) ⇒ <code>Object</code>
Provides a simple way to retreive POST JSON Headers for use with Fetch requests.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
**Returns**: <code>Object</code> - Fetch Request Options with provided data.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | JSON Object to set as the body of the Fetch details. |

<a name="UniverseJS.universe.ShowModal"></a>

#### universe.ShowModal(id)
Sets a Modal's Display to "block" to show it on the page.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Is the DOM ID of the Modal to Display. |

<a name="UniverseJS.universe.CloseModal"></a>

#### universe.CloseModal(id)
Sets a Modal's Display to "none" to remove it from the page.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Is the DOM ID of the Modal to Remove. |

<a name="UniverseJS.universe.ShowTemplateModal"></a>

#### universe.ShowTemplateModal(text)
Will show an onscreen modal assuming the Template Modal Page is used. And will handle the closing of said modal.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
**Implements**: <code>CloseModal()</code>, <code>ShowModal()</code>  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Is the Text to show within the Modal. |

<a name="UniverseJS.universe.WriteUserSettings"></a>

#### universe.WriteUserSettings(requestOptions, successCallback, errorCallback)
Uses GoPage APIs to set new UserSettings to the Server.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  

| Param | Type | Description |
| --- | --- | --- |
| requestOptions | <code>string</code> | Will be the Request Options passed to Fetch for the request |
| successCallback | <code>function</code> | The function to execute if the query is successful. |
| errorCallback | <code>function</code> | The function to execute if the query fails. The error callback is **REQUIRED** to accept a JSON Object of the error. |

<a name="UniverseJS.universe.GenericErrorHandler"></a>

#### universe.GenericErrorHandler(snackbar, msg)
Intended to be a simple way to create an Error Snackbar that has now been superseded by SnackbarError.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
**Implements**: <code>SnackbarError()</code>  
**Todo**

- [ ] Determine if this is still needed or in use.


| Param | Type | Description |
| --- | --- | --- |
| snackbar | <code>string</code> | DOM ID of the Snackbar to Target. |
| msg | <code>string</code> | The Message to display in the text of the Snackbar and to output to the console. |

<a name="UniverseJS.universe.FindReturnsString"></a>

#### universe.FindReturnsString(action, status) ⇒ <code>string</code>
Can be used to help determine the right translated message.
This does require that returnGlobalJS template is in use on the page.
This will use the Global Strings to attempt to return the right action that has been preformed.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
**Returns**: <code>string</code> - The translated string needed, **Remember** this will likely be a Composite String and shouldn't be displayed as is.  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | Is the action that has occured. Valid values: "delete", "install", "update" |
| status | <code>string</code> | Is the status of said action. Valid Values: "pass", "fail" |

<a name="UniverseJS.universe.HotReload"></a>

#### universe.HotReload(elementID, url, callback, callbackArg)
Adds an easy way to Hot-Reload pages that are capable of doing so server side.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  

| Param | Type | Description |
| --- | --- | --- |
| elementID | <code>string</code> | The DOM ID of the element to replace in the Hot-Reload Action. |
| url | <code>string</code> | The URL to query for Hot-Reloading page data. |
| callback | <code>function</code> | Function to execute after the Hot-Reload is finished. Useful for calling any functions needed to add Event Handlers or process data on the page. |
| callbackArg | <code>string</code> | Arguments to pass to the callback function, useful if the callback needs to identify that its a callback. |

**Example**  
```js
universe.HotReload("linkItemList", "/", homePageInit, "reload");
```
<a name="UniverseJS.universe.Loader"></a>

#### universe.Loader(shouldShow)
Simple method of injecting a Loading animation onto the center of the page.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  

| Param | Type | Description |
| --- | --- | --- |
| shouldShow | <code>boolean</code> | indicates if the loader is being turned off or on. True being on, and False being off. |

<a name="UploadImageJS"></a>

## UploadImageJS : <code>File</code>
The JavaScript file loaded with the Upload Image Page.

**Kind**: global variable  

* [UploadImageJS](#UploadImageJS) : <code>File</code>
    * [.loadAvailableImages()](#UploadImageJS.loadAvailableImages)
    * [.insertImg(imageLoc)](#UploadImageJS.insertImg) ⇒ <code>string</code>
    * [.setImage(name)](#UploadImageJS.setImage)
    * [.unsetImage()](#UploadImageJS.unsetImage)

<a name="UploadImageJS.loadAvailableImages"></a>

### UploadImageJS.loadAvailableImages()
Builds the main content of the UploadImage Page. By using GoPage API's to check saved images, and display them.

**Kind**: static method of [<code>UploadImageJS</code>](#UploadImageJS)  
**Todo**

- [ ] Inline with the Neutuer JavaScript Initiative, this should be done in Golang, and injected into the template.

<a name="UploadImageJS.insertImg"></a>

### UploadImageJS.insertImg(imageLoc) ⇒ <code>string</code>
Helps loadAvailableImages to build the page, by returned an HTML string

**Kind**: static method of [<code>UploadImageJS</code>](#UploadImageJS)  
**Returns**: <code>string</code> - HTML typed string, containing an IMG DOM Element  

| Param | Type | Description |
| --- | --- | --- |
| imageLoc | <code>string</code> | is the URL to access the image. |

<a name="UploadImageJS.setImage"></a>

### UploadImageJS.setImage(name)
Will attempt to save the specified image as the Users background image.

**Kind**: static method of [<code>UploadImageJS</code>](#UploadImageJS)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | is the name of the image you want to set as the background image. |

<a name="UploadImageJS.unsetImage"></a>

### UploadImageJS.unsetImage()
Will query GoPage API's to remove whatever is currently set as the User Image

**Kind**: static method of [<code>UploadImageJS</code>](#UploadImageJS)  
