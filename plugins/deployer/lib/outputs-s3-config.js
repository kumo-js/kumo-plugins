'use strict';

class OutputsS3Config {

    constructor(params) {
        this._envNamespace = params.envNamespace;
        this._settings = params.settings;
    }

    bucket() {
        const moduleName = this._settings.moduleName;
        const prefix = `${this._envNamespace}/${moduleName}/`;
        return Object.assign(this._settings.outputsBucket, {prefix});
    }
}

module.exports = OutputsS3Config;
