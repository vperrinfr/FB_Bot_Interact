var resolve = require('path').resolve
var createWriteStream = require('fs').createWriteStream
var writeFileSync = require('fs').writeFileSync
var unlinkSync = require('fs').unlinkSync
var existsSync = require('fs').existsSync
var assert = require('assert')
var dwn = require('../')
var _download = dwn._download

describe('downloader', function(){

  this.timeout(10000)

  var uri = 'http://fritx.me/resume/%E6%9E%97%E4%BA%AE%E7%9A%84%E7%AE%80%E5%8E%86-%E6%8B%89%E5%8B%BE%E7%BD%91-%E6%9C%80%E4%B8%93%E4%B8%9A%E7%9A%84%E4%BA%92%E8%81%94%E7%BD%91%E6%8B%9B%E8%81%98%E5%B9%B3%E5%8F%B0_files/Cgo8PFV1ikeAeTedAAAXfvdWB1w998.jpg'
  var dest = resolve(__dirname, '123.jpg')

  it('should ._download', function(done){

    // unlink if exists
    try { unlinkSync(dest) } catch(e) {}

    var stream = _download(uri)

    stream.on('progress', function(v){
      console.log('progress:', v)
    })
    stream.on('end', done)
    stream.on('error', done)

    stream.pipe(createWriteStream(dest))

  })

  it('should ._download successfully', function(){

    assert(existsSync(dest))

    // unlink if exists
    try { unlinkSync(dest) } catch(e) {}

  })

  it('should dwn', function(done){

    // unlink if exists
    try { unlinkSync(dest) } catch(e) {}

    dwn({
      uri: uri,
      progress: function(v){
        console.log('progress:', v)
      },
      callback: function(err, buf){
        if (err) {
          done(err)
          return
        }
        writeFileSync(dest, buf)
        done()
      }
    })

  })

  it('should dwn successfully', function(){

    assert(existsSync(dest))

    // unlink if exists
    try { unlinkSync(dest) } catch(e) {}

  })

})
