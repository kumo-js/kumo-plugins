'use strict';

const _ = require('lodash');
const path = require('path');

class OutputsS3Config {

    constructor(params) {
        this._appSettings = params.appSettings;
        this._env = params.env;
    }

    bucket() {
        const appName = this._appSettings.appName();
        const prefix = path.join(this._env, appName);
        const outputsBucket = this._appSettings.outputsBucket();
        return _.assign({prefix}, outputsBucket);
    }
}

module.exports = OutputsS3Config;
