"use strict";

// @formatter:off
/**
 * Find image data using the deprecated [Google Image Search API]{@link https://developers.google.com/image-search/v1/devguide}. Google has disabled the API. As such, this module is no longer functional.
 * @author Matthew Hasbach
 * @copyright Matthew Hasbach 2015
 * @license MIT
 * @module node-google-image
 * @example
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
 */
// @formatter:on

let fs = require('fs'),
    dwn = require('dwn'),
    http = require('axios'),
    steamToArray = require('stream-to-array'),
    isPlainObject = require('lodash.isplainobject'),
    apiURL = 'http://ajax.googleapis.com/ajax/services/search/images',
    defaultOptions = {
        v: '1.0',
        start: 0,
        rsz: 1
    },
    /**
     * Download an image
     * @alias imageData#download
     * @memberof imageData
     * @param {imageData#download~callback} [cb] - A callback to be executed once the download is complete
     * @returns {Promise}
     */
    download = function(cb) {
        /**
         * @callback imageData#download~callback
         * @param {Error|null} err - An error if one was encountered
         * @param {Buffer|undefined} imageData - Image data
         */
        let url = this.url;

        return new Promise(function(resolve, reject) {
            steamToArray(dwn._download(url), function(err, arr) {
                if (err) {
                    return (cb || reject)(err);
                }

                let buffer = Buffer.concat(arr);

                cb ? cb(null, buffer) : resolve(buffer);
            });
        });
    },
    /**
     * Save an image
     * @alias imageData#save
     * @memberof imageData
     * @param {string} path - A callback to be executed once the image has been saved
     * @param {imageData#save~callback} [cb] - A callback to be executed once the image has been saved
     * @returns {Promise}
     */
    save = function(path, cb) {
        /**
         * @callback imageData#save~callback
         * @param {Error|null} err - An error if one was encountered
         */
        let url = this.url;

        return new Promise(function(resolve, _reject) {
            let readStream = dwn._download(url);

            readStream.on('end', cb || resolve);
            readStream.on('error', cb || _reject);
            readStream.pipe(fs.createWriteStream(path));
        });
    },
    googleImage = class {
        /**
         * @param {string} [q] - A search query. This may be omitted and supplied later using the [options]{@link node-google-image#options} or [search]{@link node-google-image#search} method.
         * @constructs node-google-image
         */
        constructor(q) {
            this._options = Object.assign({q}, defaultOptions);
        }

        /**
         * Set the desired size of the result set
         * @method node-google-image#quantity
         * @param {number} quantity - The result set size
         * @chainable
         */
        quantity(quantity) {
            this._options.rsz = quantity;
            return this;
        }

        /**
         * Set the desired page number
         * @method node-google-image#page
         * @param {number} page - The page number
         * @chainable
         */
        page(page) {
            this._options.start = page;
            return this;
        }

        /**
         * Set Google Image Search API [options]{@link https://developers.google.com/image-search/v1/jsondevguide#json_args}
         * @method node-google-image#options
         * @param {Object} opt - API options
         * @chainable
         */
        options(opt) {
            this._options = Object.assign(this._options, opt);
            return this;
        }

        /**
         * Search for images. The default page and quantity are 0 and 1, respectively.
         * @method node-google-image#search
         * @param {Object} [opt] - API [options]{@link https://developers.google.com/image-search/v1/jsondevguide#json_args}
         * @param {search~callback} [cb] - A callback to be executed once the search is complete
         * @returns {Promise}
         */
        search(opt, cb) {
            /**
             * @callback search~callback
             * @param {Error|null} err - An error if one was encountered
             * @param {responseDataResults|undefined} responseData - [Response data]{@link https://developers.google.com/image-search/v1/jsondevguide#results_guaranteed} results
             */
            isPlainObject(opt) ? this.options(opt) : cb = opt;

            let options = this._options;

            return new Promise(
                function(resolve, _reject) {
                    let reject = cb || _reject;

                    if (!options.q) {
                        return reject(new Error('query must be supplied'));
                    }

                    http.get(apiURL, {params: options}).then(function(res) {
                        if (res.data.responseDetails) {
                            return reject(new Error(res.data.responseDetails));
                        }
                        /**
                         * [Response data]{@link https://developers.google.com/image-search/v1/jsondevguide#results_guaranteed} results
                         * @typedef {Array<imageData>} responseDataResults
                         * @global
                         */
                        /**
                         * [Image data]{@link https://developers.google.com/image-search/v1/jsondevguide#results_guaranteed} extended with the image's filename and convenience methods
                         * @typedef {Object<string, function>} imageData
                         * @global
                         */
                        for (let image of res.data.responseData.results) {
                            /**
                             * Image filename
                             * @alias imageData#fileName
                             * @memberof imageData
                             * @type {string}
                             */
                            image.fileName = image.url.substr(image.url.lastIndexOf('/') + 1);
                            image.download = download;
                            image.save = save;
                        }

                        cb ? cb(null, res.data.responseData.results) : resolve(res.data.responseData.results);
                    }).catch(function(res) {
                        reject(new Error(`${res.status} ${res.statusText}`));
                    });
                });
        }
    };

module.exports = googleImage;

console.warn('Google has disabled the deprecated Image Search API. As such, this module is no longer functional.');