'use strict';

class OutputsS3Config {

    constructor(params) {
        this._env = params.env;
        this._settings = params.settings;
    }

    bucket() {
        const moduleName = this._settings.moduleName();
        const defaultPrefix = `${this._env}/${moduleName}`;
        const outputsBucket = this._settings.outputsBucket();
        const prefix = this._addSlash(outputsBucket.prefix || defaultPrefix);
        return Object.assign(outputsBucket, {prefix});
    }

    _addSlash(prefix) {
        return prefix && !prefix.endsWith('/') ? `${prefix}/` : prefix;
    }
}

module.exports = OutputsS3Config;
