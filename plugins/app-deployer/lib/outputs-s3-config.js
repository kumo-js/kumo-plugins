'use strict';

class OutputsS3Config {

    constructor(params) {
        this._settings = params.settings;
        this._env = params.env;
    }

    bucket() {
        const appName = this._settings.appName();
        const defaultPrefix = `${this._env}/${appName}`;
        const outputsBucket = this._settings.outputsBucket();
        const prefix = this._addSlash(outputsBucket.prefix || defaultPrefix);
        return Object.assign(outputsBucket, {prefix});
    }

    _addSlash(prefix) {
        return prefix && !prefix.endsWith('/') ? `${prefix}/` : prefix;
    }
}

module.exports = OutputsS3Config;
