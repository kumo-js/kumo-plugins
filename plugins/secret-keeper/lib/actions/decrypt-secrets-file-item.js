'use strict';

const _ = require('lodash');

class DecryptSecretsFileItem {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._options = params.options;
        this._outputter = params.outputter;
        this._secretService = params.secretService;
    }

    execute() {
        return this._readInputFile()
            .then(obj => _.get(obj, this._options.itemPath, ''))
            .then(value => this._decryptValue(value))
            .then(result => this._outputter.write(result));
    }

    _decryptValue(value) {
        const params = Object.assign(_.omit(this._options, 'file', 'itemPath'), {value});
        return this._secretService.decrypt(params);
    }

    _readInputFile() {
        return this._fileReader.readJson(this._options.file);
    }
}

module.exports = DecryptSecretsFileItem;
