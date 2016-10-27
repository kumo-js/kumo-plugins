'use strict';

const _ = require('lodash');
const traverse = require('../../../../common-lib/traverse');

class EncryptFile {

    constructor(params) {
        this._args = params.args;
        this._fileReader = params.fileReader;
        this._resultFormatter = params.resultFormatter;
        this._secretService = params.secretService;
        this._stdOut = params.stdOut;
    }

    execute() {
        return this._readInputFile()
            .then(data => traverse.values(data, value => this._encryptValue(value)))
            .then(result => this._resultFormatter.format(result, this._args))
            .then(result => this._stdOut.write(result));
    }

    _encryptValue(value) {
        const params = Object.assign(_.omit(this._args, 'file'), {value});
        return this._secretService.encrypt(params);
    }

    _readInputFile() {
        return this._fileReader.readJson(this._args.file);
    }
}

module.exports = EncryptFile;
