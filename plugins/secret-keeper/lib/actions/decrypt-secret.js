'use strict';

class DecryptSecret {

    constructor(params) {
        this._options = params.options;
        this._outputter = params.outputter;
        this._secretService = params.secretService;
    }

    execute() {
        return this._decryptValue().then(result => this._outputter.write(result));
    }

    _decryptValue() {
        return this._secretService.decrypt(this._options);
    }
}

module.exports = DecryptSecret;
