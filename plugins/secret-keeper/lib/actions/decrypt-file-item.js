'use strict';

const _ = require('lodash');

class DecryptFileItem {

    constructor(params) {
        this._args = params.args;
        this._fileReader = params.fileReader;
        this._secretService = params.secretService;
        this._stdOut = params.stdOut;
    }

    execute() {
        return this._readInputFile()
            .then(data => _.get(data, this._args.item, ''))
            .then(value => this._decryptValue(value))
            .then(result => this._stdOut.write(result));
    }

    _decryptValue(value) {
        const params = Object.assign(_.omit(this._args, 'file', 'item'), {value});
        return this._secretService.decrypt(params);
    }

    _readInputFile() {
        return this._fileReader.readAsObject(this._args.file);
    }
}

module.exports = DecryptFileItem;
