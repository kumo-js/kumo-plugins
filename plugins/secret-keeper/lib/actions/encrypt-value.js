'use strict';

class EncryptSecret {

    constructor(params) {
        this._args = params.args;
        this._secretService = params.secretService;
        this._stdOut = params.stdOut;
    }

    execute() {
        return this._encryptValue().then(result => this._stdOut.write(result));
    }

    _encryptValue() {
        return this._secretService.encrypt(this._args);
    }
}

module.exports = EncryptSecret;
