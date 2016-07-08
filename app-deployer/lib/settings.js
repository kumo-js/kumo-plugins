'use strict';

const _ = require('lodash');

class Settings {

    constructor(params) {
        this._kumoSettings = params.kumoSettings;
        this._rawSettings = params.rawSettings;
    }

    appName() {
        return this._app().name;
    }

    outputsBucket() {
        const name = _.get(this._kumoSettings, 'appDeployer.outputsBucket.name');
        return _.assign({name}, this._app().outputsBucket);
    }

    _app() {
        return this._rawSettings.app;
    }
}

module.exports = Settings;
