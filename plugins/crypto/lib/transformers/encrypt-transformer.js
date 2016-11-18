'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class EncryptTransformer {

    constructor(params) {
        this._args = params.args;
        this._encryptedValueSerializer = params.encryptedValueSerializer;
        this._profileSettings = params.profileSettings;
        this._providerFactory = params.providerFactory;
    }

    transform(value) {
        const canEncrypt = value !== null && value !== undefined;
        if (!canEncrypt) return Promise.resolve(value);
        return this._provider().encrypt(value.toString(), this._encryptParams())
            .then(encryptedValue => this._serializeEncryptedValue(encryptedValue));
    }

    _serializeEncryptedValue(value) {
        const provider = this._providerName();
        const metadata = Object.assign({provider}, this._encryptParams());
        return this._encryptedValueSerializer.serialize(value, metadata);
    }

    _encryptParams() {
        if (this._cachedEncryptParams) return this._cachedEncryptParams;
        const supportedEncryptionParams = this._provider().supportedEncryptionParams();
        this._cachedEncryptParams = _.pick(this._mergedSettings(), supportedEncryptionParams);
        return this._cachedEncryptParams;
    }

    _provider() {
        if (this._cachedProvider) return this._cachedProvider;
        this._cachedProvider = this._providerFactory.createProvider(this._providerName());
        return this._cachedProvider;
    }

    _providerName() {
        return this._mergedSettings().provider;
    }

    _mergedSettings() {
        return Object.assign({}, this._profileSettings[this._args.profile], this._args);
    }
}

module.exports = EncryptTransformer;
