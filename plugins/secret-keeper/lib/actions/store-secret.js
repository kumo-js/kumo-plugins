'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class StoreSecret {

    constructor(params) {
        this._args = params.args;
        this._fileReader = params.fileReader;
        this._fs = Promise.promisifyAll(params.fs);
        this._resultFormatter = params.resultFormatter;
        this._secretService = params.secretService;
    }

    execute() {
        return this._encryptValue().then(value => this._storeValue(value));
    }

    _encryptValue() {
        const params = _.omit(this._args, 'file', 'item');
        return this._secretService.encrypt(params);
    }

    _storeValue(value) {
        const file = this._args.file;
        const item = this._args.item;
        return this._fileReader.readJson(file, {ignoreNotFound: true})
            .then(data => _.set(data || {}, item, value))
            .then(result => this._resultFormatter.format(result, this._args))
            .then(result => this._fs.writeFileAsync(file, result));
    }
}

module.exports = StoreSecret;
