'use strict';

const _ = require('lodash');
const AWSHelpers = require('../../../common-lib/lib/aws-helpers');
const S3OutputsStore = require('./output-stores/s3-outputs-store');
const NullOutputsStore = require('./output-stores/null-outputs-store');

class OutputsStoreFactory {

    createStore(outputsStoreDef) {
        const type = _.get(outputsStoreDef, 'type');
        if (!type) return this._createNullOutputsStore();
        const createFn = this._outputsStoreCreators()[type];
        if (!createFn) throw new Error(`Unsupported outputs store type ${type}`);
        return createFn.call(this, outputsStoreDef);
    }

    _outputsStoreCreators() {
        return {
            's3-bucket': this._createS3OutputsStore
        };
    }

    _createS3OutputsStore(outputsDef) {
        const awsHelpers = new AWSHelpers();
        const params = _.omit(outputsDef, ['type']);
        return new S3OutputsStore(Object.assign(params, {awsHelpers}));
    }

    _createNullOutputsStore() {
        return new NullOutputsStore();
    }
}

module.exports = OutputsStoreFactory;
