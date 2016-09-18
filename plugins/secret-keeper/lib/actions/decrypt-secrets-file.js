'use strict';

const _ = require('lodash');
const traverse = require('../../../../common-lib/traverse');

class DecryptSecretsFile {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._options = params.options;
        this._outputter = params.outputter;
        this._secretService = params.secretService;
    }

    execute() {
        return this._readInputFile()
            .then(obj => traverse.values(obj, value => this._decryptValue(value)))
            .then(obj => this._outputter.write(JSON.stringify(obj)));
    }

    _decryptValue(value) {
        const params = Object.assign(_.omit(this._options, 'file'), {value});
        return this._secretService.decrypt(params);
    }

    _readInputFile() {
        return this._fileReader.readJson(this._options.file);
    }
}

module.exports = DecryptSecretsFile;