'use strict';

class Kms {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
    }

    encrypt(params) {
        const value = {KeyId: params.keyId, Plaintext: params.value};
        return this._kms(params.region).encrypt(value).then(result => ({
            value: result.CiphertextBlob.toString('base64'),
            region: params.region
        }));
    }

    decrypt(params) {
        const value = {CiphertextBlob: new Buffer(params.value, 'base64')};
        const promise = this._kms(params.region).decrypt(value);
        return promise.then(result => result.Plaintext);
    }

    _kms(region) {
        return this._awsHelpers.kms({region});
    }
}

module.exports = Kms;
