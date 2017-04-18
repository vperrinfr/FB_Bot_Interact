# dwn

A simple tool for downloading via node.js

*Base code partly copied from [hughsk/nw-download](https://github.com/hughsk/nw-download)*

## Command Line

```plain
$ npm install -g dwn
```

```plain
$ dwn http://example.com/logo.png
$ dwn http://example.com/logo.png cache/
$ dwn http://example.com/logo.png cache/boy.png
```

## Nodejs Library

```js
var dwn = require('dwn')
dwn({
  uri: 'http://example.com/logo.png',  // required
  progress: function(v){},  // eg. 15%, v=0.15
  callback: function(err, buf){}  // buffer
})
```

or with stream:

```js
var stream = dwn._download(uri)
stream.on('progress', function(v){
  console.log('progress:', v)
})
stream.on('end', done)
stream.on('error', done)
stream.pipe(createWriteStream(dest))
```
