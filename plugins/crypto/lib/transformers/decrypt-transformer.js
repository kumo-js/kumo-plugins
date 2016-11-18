'use strict';

const _ = require('lodash');

class DecryptTransformer {

    constructor(params) {
        this._encryptedValueSerializer = params.encryptedValueSerializer;
        this._providerFactory = params.providerFactory;
    }

    transform(value) {
        const isEncrypted = this._encryptedValueSerializer.canDeserialize(value);
        if (!isEncrypted) return Promise.resolve(value);
        const data = this._encryptedValueSerializer.deserialize(value);
        const provider = this._providerFactory.createProvider(data.metadata.provider);
        const decryptParams = _.omit(data.metadata, 'provider');
        return provider.decrypt(data.value, decryptParams);
    }
}

module.exports = DecryptTransformer;
