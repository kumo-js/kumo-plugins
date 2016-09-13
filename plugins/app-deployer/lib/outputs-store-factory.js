'use strict';

const OutputsS3Config = require('./outputs-s3-config');
const OutputsS3Store = require('./outputs-s3-store');

class OutputsStoreFactory {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
    }

    createStore(settings, env) {
        return new OutputsS3Store({
            outputsS3Config: this._outputsS3Config(settings, env),
            awsHelpers: this._awsHelpers
        });
    }

    _outputsS3Config(settings, env) {
        return new OutputsS3Config({settings, env});
    }
}

module.exports = OutputsStoreFactory;
