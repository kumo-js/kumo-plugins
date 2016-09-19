'use strict';

const _ = require('lodash');

class StoreSecret {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._fileWriter = params.fileWriter;
        this._options = params.options;
        this._secretService = params.secretService;
    }

    execute() {
        return this._encryptValue().then(result => this._storeResult(result));
    }

    _encryptValue() {
        const params = _.omit(this._options, 'file', 'item');
        return this._secretService.encrypt(params);
    }

    _storeResult(result) {
        const file = this._options.file;
        const item = this._options.item;
        return this._fileReader.readJson(file, {ignoreNotFound: true})
            .then(contents => _.set(contents || {}, item, result))
            .then(contents => this._fileWriter.writeJson(file, contents));
    }
}

module.exports = StoreSecret;
