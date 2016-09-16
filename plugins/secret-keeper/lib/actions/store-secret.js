'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class StoreSecret {

    constructor(params) {
        this._fs = Promise.promisifyAll(params.fs);
        this._fileReader = params.fileReader;
        this._options = params.options;
        this._secretService = params.secretService;
    }

    execute() {
        return this._encryptValue().then(result => this._storeResult(result));
    }

    _encryptValue() {
        const params = _.omit(this._options, 'file', 'itemPath');
        return this._secretService.encrypt(params);
    }

    _storeResult(result) {
        const file = this._options.file;
        const itemPath = this._options.itemPath;
        return this._fileReader.readJson(file, {ignoreNotFound: true})
            .then(contents => _.set(contents || {}, itemPath, result))
            .then(contents => this._fs.writeFileAsync(file, contents));
    }
}

module.exports = StoreSecret;
