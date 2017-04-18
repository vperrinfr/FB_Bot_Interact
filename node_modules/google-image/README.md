## Modules

<dl>
<dt><a href="#module_node-google-image">node-google-image</a></dt>
<dd><p>Find image data using the deprecated <a href="https://developers.google.com/image-search/v1/devguide">Google Image Search API</a>. Google has disabled the API. As such, this module is no longer functional.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#node-google-image">node-google-image</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#responseDataResults">responseDataResults</a> : <code><a href="#imageData">Array.&lt;imageData&gt;</a></code></dt>
<dd><p><a href="https://developers.google.com/image-search/v1/jsondevguide#results_guaranteed">Response data</a> results</p>
</dd>
<dt><a href="#imageData">imageData</a> : <code>Object.&lt;string, function()&gt;</code></dt>
<dd><p><a href="https://developers.google.com/image-search/v1/jsondevguide#results_guaranteed">Image data</a> extended with the image&#39;s filename and convenience methods</p>
</dd>
</dl>

<a name="module_node-google-image"></a>
## node-google-image
Find image data using the deprecated [Google Image Search API](https://developers.google.com/image-search/v1/devguide). Google has disabled the API. As such, this module is no longer functional.

**Author:** Matthew Hasbach  
**License**: MIT  
**Copyright**: Matthew Hasbach 2015  
**Example**  
```js
new googleImage('car')
    .quantity(5)
    .page(2)
    .search()
    .then(function(images) {
        images[0].save(path.join(__dirname, images[0].fileName)).then(function() {
            console.log('done');
        }).catch(function(err) {
            console.error(err);
        });
    }).catch(function(err) {
        console.error(err);
    });
```
<a name="module_node-google-image..googleImage"></a>
### node-google-image~googleImage
**Kind**: inner class of <code>[node-google-image](#module_node-google-image)</code>  
<a name="node-google-image"></a>
## node-google-image
**Kind**: global class  

| Param | Type | Description |
| --- | --- | --- |
| [q] | <code>string</code> | A search query. This may be omitted and supplied later using the [options](#node-google-image+options) or [search](#node-google-image+search) method. |


* [node-google-image](#node-google-image)
    * [.quantity(quantity)](#node-google-image+quantity) ↩︎
    * [.page(page)](#node-google-image+page) ↩︎
    * [.options(opt)](#node-google-image+options) ↩︎
    * [.search([opt], [cb])](#node-google-image+search) ⇒ <code>Promise</code>

<a name="node-google-image+quantity"></a>
### node-google-image.quantity(quantity) ↩︎
Set the desired size of the result set

**Kind**: instance method of <code>[node-google-image](#node-google-image)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>number</code> | The result set size |

<a name="node-google-image+page"></a>
### node-google-image.page(page) ↩︎
Set the desired page number

**Kind**: instance method of <code>[node-google-image](#node-google-image)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>number</code> | The page number |

<a name="node-google-image+options"></a>
### node-google-image.options(opt) ↩︎
Set Google Image Search API [options](https://developers.google.com/image-search/v1/jsondevguide#json_args)

**Kind**: instance method of <code>[node-google-image](#node-google-image)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| opt | <code>Object</code> | API options |

<a name="node-google-image+search"></a>
### node-google-image.search([opt], [cb]) ⇒ <code>Promise</code>
Search for images. The default page and quantity are 0 and 1, respectively.

**Kind**: instance method of <code>[node-google-image](#node-google-image)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [opt] | <code>Object</code> | API [options](https://developers.google.com/image-search/v1/jsondevguide#json_args) |
| [cb] | <code>[callback](#search..callback)</code> | A callback to be executed once the search is complete |

<a name="responseDataResults"></a>
## responseDataResults : <code>[Array.&lt;imageData&gt;](#imageData)</code>
[Response data](https://developers.google.com/image-search/v1/jsondevguide#results_guaranteed) results

**Kind**: global typedef  
<a name="imageData"></a>
## imageData : <code>Object.&lt;string, function()&gt;</code>
[Image data](https://developers.google.com/image-search/v1/jsondevguide#results_guaranteed) extended with the image's filename and convenience methods

**Kind**: global typedef  

* [imageData](#imageData) : <code>Object.&lt;string, function()&gt;</code>
    * [.fileName](#imageData+fileName) : <code>string</code>
    * [.download([cb])](#imageData+download) ⇒ <code>Promise</code>
        * [~callback](#imageData+download..callback) : <code>function</code>
    * [.save(path, [cb])](#imageData+save) ⇒ <code>Promise</code>
        * [~callback](#imageData+save..callback) : <code>function</code>

<a name="imageData+fileName"></a>
### imageData.fileName : <code>string</code>
Image filename

**Kind**: instance property of <code>[imageData](#imageData)</code>  
<a name="imageData+download"></a>
### imageData.download([cb]) ⇒ <code>Promise</code>
Download an image

**Kind**: instance method of <code>[imageData](#imageData)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [cb] | <code>[callback](#imageData+download..callback)</code> | A callback to be executed once the download is complete |

<a name="imageData+download..callback"></a>
#### download~callback : <code>function</code>
**Kind**: inner typedef of <code>[download](#imageData+download)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> &#124; <code>null</code> | An error if one was encountered |
| imageData | <code>Buffer</code> &#124; <code>undefined</code> | Image data |

<a name="imageData+save"></a>
### imageData.save(path, [cb]) ⇒ <code>Promise</code>
Save an image

**Kind**: instance method of <code>[imageData](#imageData)</code>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | A callback to be executed once the image has been saved |
| [cb] | <code>[callback](#imageData+save..callback)</code> | A callback to be executed once the image has been saved |

<a name="imageData+save..callback"></a>
#### save~callback : <code>function</code>
**Kind**: inner typedef of <code>[save](#imageData+save)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> &#124; <code>null</code> | An error if one was encountered |

