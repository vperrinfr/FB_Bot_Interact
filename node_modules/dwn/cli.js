#!/usr/bin/env node
var resolve = require('path').resolve
var basename = require('path').basename
var dirname = require('path').dirname
var statSync = require('fs').statSync
var createWriteStream = require('fs').createWriteStream
var mkdirpSync = require('mkdirp').sync
var bar = require('progress-bar').create(process.stdout)
var dwn = require('./')

var uri = process.argv[2]
var dest = process.argv[3]

if (!uri) {
  console.error('uri required')
  process.exit(1)
}

dest = dest || './'

try {
  if (statSync(dest).isDirectory()) {
    dest = resolve(dest, basename(uri))
  }
} catch(err) {}

// mkdirp unless exists
try { mkdirpSync(dirname(dest)) } catch(err) {}

var stream = dwn._download(uri)

stream.on('progress', function(v){
  bar.update(v)
})
stream.on('end', done)
stream.on('error', done)

stream.pipe(createWriteStream(dest))

function done(err) {
  if (err) {
    console.error('download error')
    process.exit(1)
  }
}
