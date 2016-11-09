'use strict';

const _ = require('lodash');
const traverse = require('../../../../common-lib/lib/traverse');

class DecryptFile {

    constructor(params) {
        this._args = params.args;
        this._fileReader = params.fileReader;
        this._resultFormatter = params.resultFormatter;
        this._secretService = params.secretService;
        this._stdOut = params.stdOut;
    }

    execute() {
        return this._readInputFile()
            .then(data => traverse.values(data, value => this._decryptValue(value)))
            .then(result => this._resultFormatter.format(result, this._args))
            .then(result => this._stdOut.write(result));
    }

    _decryptValue(value) {
        const params = Object.assign(_.omit(this._args, 'file'), {value});
        return this._secretService.decrypt(params);
    }

    _readInputFile() {
        return this._fileReader.readJson(this._args.file);
    }
}

module.exports = DecryptFile;
