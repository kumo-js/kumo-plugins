
'use strict';

class ZipHelper {

    constructor(params) {
        this._createJSZip = params.createJSZip;
        this._fs = params.fs;
    }

    addDataToZip(params) {
        return Promise.resolve()
            .then(() => this._fs.readFileAsync(params.zipPath))
            .then(fileContents => this._createJSZip().loadAsync(fileContents))
            .then(jszip => jszip.file(params.pathInZip, params.data))
            .then(jszip => jszip.generateAsync({type: 'nodebuffer'}));
    }

}

module.exports = ZipHelper;
