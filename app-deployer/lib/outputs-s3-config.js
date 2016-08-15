'use strict';

const _ = require('lodash');
const path = require('path');

class OutputsS3Config {

    constructor(params) {
        this._settings = params.settings;
        this._env = params.env;
    }

    bucket() {
        const appName = this._settings.appName();
        const prefix = path.join(this._env, appName);
        const outputsBucket = this._settings.outputsBucket();
        return _.assign({prefix}, outputsBucket);
    }
}

module.exports = OutputsS3Config;
