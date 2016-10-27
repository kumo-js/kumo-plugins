'use strict';

class DecryptSecret {

    constructor(params) {
        this._args = params.args;
        this._secretService = params.secretService;
        this._stdOut = params.stdOut;
    }

    execute() {
        return this._decryptValue().then(result => this._stdOut.write(result));
    }

    _decryptValue() {
        return this._secretService.decrypt(this._args);
    }
}

module.exports = DecryptSecret;
