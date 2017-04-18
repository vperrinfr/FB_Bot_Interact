//source code copied from hughsk/nw-download
//https://github.com/hughsk/nw-download/blob/master/index.js
var through   = require('through2')
var request   = require('request')
var url       = require('url')
var BufferHelper       = require('bufferhelper')

module.exports = dwn
dwn._download = download  // expose _download

function dwn(opts){
  var uri = opts.uri
  var progress = opts.progress || function(){}
  var callback = opts.callback || function(){}
  var callback_fired = false

  var stream = download(uri)
  var bufh = new BufferHelper()

  stream.on('data', function(buf){
    bufh.concat(buf)
  })
  stream.on('progress', progress)
  stream.on('end', done)
  stream.on('error', done)

  function done(err){
    if (callback_fired) {
      return
    }
    callback_fired = true

    if (err) {
      callback(err)
      return
    }

    callback(null, bufh.toBuffer())
  }
}

function download(uri) {
  var stream   = through(write)
  var progress = 0
  var total    = 0

  request.head(uri, function(err, res) {
    if (err) return stream.emit('error', err)
    total = parseInt(res.headers['content-length'], 10)
    request.get(uri).pipe(stream)
  })

  return stream

  function write(data, _, next) {
    this.push(data)
    stream.emit('progress'
      , (progress += data.length) / total
      , progress
      , total
    )
    next()
  }
}
