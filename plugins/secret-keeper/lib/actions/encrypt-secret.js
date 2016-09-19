'use strict';

class EncryptSecret {

    constructor(params) {
        this._args = params.args;
        this._outputter = params.outputter;
        this._secretService = params.secretService;
    }

    execute() {
        return this._encryptValue().then(result => this._outputter.write(result));
    }

    _encryptValue() {
        return this._secretService.encrypt(this._args);
    }
}

module.exports = EncryptSecret;
