'use strict';

const _ = require('lodash');

class DecryptSecretsFileItem {

    constructor(params) {
        this._args = params.args;
        this._fileReader = params.fileReader;
        this._outputter = params.outputter;
        this._secretService = params.secretService;
    }

    execute() {
        return this._readInputFile()
            .then(obj => _.get(obj, this._args.item, ''))
            .then(value => this._decryptValue(value))
            .then(result => this._outputter.write(result));
    }

    _decryptValue(value) {
        const params = Object.assign(_.omit(this._args, 'file', 'item'), {value});
        return this._secretService.decrypt(params);
    }

    _readInputFile() {
        return this._fileReader.readJson(this._args.file);
    }
}

module.exports = DecryptSecretsFileItem;
