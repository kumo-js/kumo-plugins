'use strict';

const OutputsS3Config = require('./outputs-s3-config');
const OutputsS3Store = require('./outputs-s3-store');

class OutputsStoreFactory {

    constructor(params) {
        this._s3Helper = params.s3Helper;
    }

    createStore(appSettings, env) {
        return new OutputsS3Store({
            outputsS3Config: this._outputsS3Config(appSettings, env),
            s3Helper: this._s3Helper
        });
    }

    _outputsS3Config(appSettings, env) {
        return new OutputsS3Config({appSettings, env});
    }
}

module.exports = OutputsStoreFactory;
