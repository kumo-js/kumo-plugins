'use strict';

const _ = require('lodash');

class OutputsS3Config {

    constructor(params) {
        this._settings = params.settings;
        this._env = params.env;
    }

    bucket() {
        const appName = this._settings.appName();
        const prefix = `${this._env}/${appName}`;
        const outputsBucket = this._settings.outputsBucket();
        const bucket = _.assign({prefix}, outputsBucket);
        return _.assign({}, bucket, {prefix: this._addTrailingSlash(bucket.prefix)});
    }

    _addTrailingSlash(prefix) {
        return prefix && !prefix.endsWith('/') ? `${prefix}/` : prefix;
    }
}

module.exports = OutputsS3Config;
