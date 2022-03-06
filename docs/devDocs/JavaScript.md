## Functions

<dl>
<dt><a href="#onPageLoad">onPageLoad()</a></dt>
<dd><p>onPageLoad builds the main content of the LinkHealth page. By checking all saved links for any errors and outputting them in proper HTML.</p>
</dd>
<dt><a href="#getHostname">getHostname(url)</a> ⇒ <code>string</code></dt>
<dd><p>getHostname returns just the Hostname of a provided link</p>
</dd>
</dl>

<a name="onPageLoad"></a>

## onPageLoad()
onPageLoad builds the main content of the LinkHealth page. By checking all saved links for any errors and outputting them in proper HTML.

**Kind**: global function  
**Todo**

- [ ] Inline with the Neuter JavaScript Initiative, this should be done in Golang, and injected into the template.

<a name="getHostname"></a>

## getHostname(url) ⇒ <code>string</code>
getHostname returns just the Hostname of a provided link

**Kind**: global function  
**Returns**: <code>string</code> - Hostname only of the provided link.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | is the URL to get a Hostname of. |

**Example**  
```js
let hostname = getHostname(link);
```
