'use strict';

class Kms {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
    }

    supportedEncryptionParams() {
        return ['keyId', 'region'];
    }

    encrypt(value, params) {
        value = {KeyId: params.keyId, Plaintext: value};
        return this._kms(params.region).encrypt(value).then(result =>
            result.CiphertextBlob.toString('base64')
        );
    }

    decrypt(value, params) {
        value = {CiphertextBlob: new Buffer(value, 'base64')};
        const promise = this._kms(params.region).decrypt(value);
        return promise.then(result => result.Plaintext.toString());
    }

    _kms(region) {
        return this._awsHelpers.kms({region});
    }
}

module.exports = Kms;
