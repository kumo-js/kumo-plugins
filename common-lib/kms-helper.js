'use strict';

class KmsHelper {

    constructor(params) {
        this._kms = params.kms;
    }

    encrypt(params) {
        return this._kms.encrypt(params).promise();
    }

    decrypt(params) {
        return this._kms.decrypt(params).promise();
    }
}

module.exports = KmsHelper;
