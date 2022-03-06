## Members

<dl>
<dt><a href="#LinkHealthJS">LinkHealthJS</a> : <code>File</code></dt>
<dd><p>The JavaScript file loaded with the Link Health Page.</p>
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

<a name="LinkHealthJS"></a>

## LinkHealthJS : <code>File</code>
The JavaScript file loaded with the Link Health Page.

**Kind**: global variable  

* [LinkHealthJS](#LinkHealthJS) : <code>File</code>
    * [.onPageLoad()](#LinkHealthJS.onPageLoad)
    * [.getHostname(url)](#LinkHealthJS.getHostname) ⇒ <code>string</code>

<a name="LinkHealthJS.onPageLoad"></a>

### LinkHealthJS.onPageLoad()
Builds the main content of the LinkHealth page. By checking all saved links for any errors and outputting them in proper HTML.

**Kind**: static method of [<code>LinkHealthJS</code>](#LinkHealthJS)  
**Todo**

- [ ] Inline with the Neuter JavaScript Initiative, this should be done in Golang, and injected into the template.

<a name="LinkHealthJS.getHostname"></a>

### LinkHealthJS.getHostname(url) ⇒ <code>string</code>
Returns just the Hostname of a provided link

**Kind**: static method of [<code>LinkHealthJS</code>](#LinkHealthJS)  
**Returns**: <code>string</code> - Hostname only of the provided link.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | is the URL to get a Hostname of. |

**Example**  
```js
let hostname = getHostname(link);
```
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
        * [.ShowTemplateModal()](#UniverseJS.universe.ShowTemplateModal)

<a name="UniverseJS.universe"></a>

### UniverseJS.universe : <code>object</code>
The namespace to access all internal functions.

**Kind**: static namespace of [<code>UniverseJS</code>](#UniverseJS)  

* [.universe](#UniverseJS.universe) : <code>object</code>
    * [.SnackbarCommon(id, textToShow, [callback], [extraClass], [img], [alt], [additionalDetails])](#UniverseJS.universe.SnackbarCommon)
    * [.SnackbarError(id, textToShow, [callback], [details])](#UniverseJS.universe.SnackbarError)
    * [.ReloadCallback()](#UniverseJS.universe.ReloadCallback) ⇒ <code>function</code>
    * [.ShowTemplateModal()](#UniverseJS.universe.ShowTemplateModal)

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
universe.SnackbarCommon("homePageSnackbar", "Success", universe.ReloadCallback())
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
<a name="UniverseJS.universe.ShowTemplateModal"></a>

#### universe.ShowTemplateModal()
Will show an onscreen modal assuming the Template Modal Page is used. And will handle the closing of said modal.

**Kind**: static method of [<code>universe</code>](#UniverseJS.universe)  
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
