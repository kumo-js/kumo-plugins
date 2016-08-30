'use strict';

const _ = require('lodash');

class Settings {

    constructor(params) {
        this._kumoSettings = params.kumoSettings;
        this._deploySettings = params.deploySettings;
        this._options = params.options;
    }

    appName() {
        return this._app().name;
    }

    config() {
        return this._app().config;
    }

    tasks() {
        return this._app().tasks;
    }

    outputsBucket() {
        const defaultRegion = this._options.region;
        const defaultBucket = _.get(this._kumoSettings, 'appDeployer.outputsBucket');
        const appBucket = this._app().outputsBucket;
        return _.assign({region: defaultRegion}, defaultBucket, appBucket);
    }

    _app() {
        return this._deploySettings.app;
    }
}

module.exports = Settings;
