'use strict';

const _ = require('lodash');

class StoreSecret {

    constructor(params) {
        this._args = params.args;
        this._fileReader = params.fileReader;
        this._fileWriter = params.fileWriter;
        this._secretService = params.secretService;
    }

    execute() {
        return this._encryptValue().then(result => this._storeResult(result));
    }

    _encryptValue() {
        const params = _.omit(this._args, 'file', 'item');
        return this._secretService.encrypt(params);
    }

    _storeResult(result) {
        const file = this._args.file;
        const item = this._args.item;
        return this._fileReader.readJson(file, {ignoreNotFound: true})
            .then(contents => _.set(contents || {}, item, result))
            .then(contents => this._fileWriter.writeJson(file, contents));
    }
}

module.exports = StoreSecret;
