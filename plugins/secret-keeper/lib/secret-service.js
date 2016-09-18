'use strict';

const _ = require('lodash');

class SecretService {

    constructor(params) {
        this._profileSettings = params.profileSettings;
        this._providerFactory = params.providerFactory;
        this._secretSerializer = params.secretSerializer;
    }

    encrypt(params) {
        params = params.profile ? this._mergeWithProfileSettings(params) : params;
        const provider = this._createProvider(params.provider);
        const encryptParams = _.omit(params, 'provider', 'profile');
        return provider.encrypt(encryptParams)
            .then(resultObj => Object.assign(resultObj, {provider: params.provider}))
            .then(resultObj => this._secretSerializer.serialize(resultObj));
    }

    decrypt(params) {
        const value = params.value;
        const isSecret = this._secretSerializer.canDeserialize(value);
        if (!isSecret) return Promise.resolve(value);
        const secret = this._secretSerializer.deserialize(value);
        const provider = this._createProvider(secret.provider);
        const decryptParams = Object.assign({}, params, _.omit(secret, 'provider'));
        return provider.decrypt(decryptParams).then(result => result.toString());
    }

    _createProvider(name) {
        return this._providerFactory.createProvider(name);
    }

    _mergeWithProfileSettings(params) {
        const profileSettings = this._profileSettings[params.profile];
        return Object.assign({}, profileSettings, params);
    }
}

module.exports = SecretService;
