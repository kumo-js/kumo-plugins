'use strict';

const AwsHelpers = require('../../../common-lib/lib/aws-helpers');
const KmsProvider = require('./providers/kms');

class ProviderFactory {

    createProvider(name) {
        if (name === 'kms') return this._kmsProvider();
        throw new Error(`Provider '${name}' not supported!`);
    }

    _kmsProvider() {
        const awsHelpers = new AwsHelpers();
        return new KmsProvider({awsHelpers});
    }
}

module.exports = ProviderFactory;
