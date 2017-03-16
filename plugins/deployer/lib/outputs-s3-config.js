'use strict';

const _ = require('lodash');

class OutputsS3Config {

    constructor(params) {
        this._envNamespace = params.envNamespace;
        this._settings = params.settings;
    }

    bucket() {
        const prefix = this._bucketPrefix();
        return Object.assign(this._settings.outputsBucket, {prefix});
    }

    _bucketPrefix() {
        const parts = _.compact([this._envNamespace, this._settings.moduleName]);
        return parts.concat(['']).join('/');
    }
}

module.exports = OutputsS3Config;
