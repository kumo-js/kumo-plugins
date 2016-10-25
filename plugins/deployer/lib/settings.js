'use strict';

const _ = require('lodash');

class Settings {

    constructor(params) {
        this._args = params.args;
        this._moduleSettings = params.moduleSettings;
        this._kumoSettings = params.kumoSettings;
    }

    moduleName() {
        return this._moduleSettings.moduleName;
    }

    config() {
        return this._moduleSettings.config;
    }

    tasks() {
        return this._moduleSettings.tasks;
    }

    outputsBucket() {
        const defaultRegion = this._args.region;
        const defaultBucket = _.get(this._kumoSettings, 'deployer.outputsBucket');
        const outputsBucket = this._moduleSettings.outputsBucket;
        return Object.assign({region: defaultRegion}, defaultBucket, outputsBucket);
    }
}

module.exports = Settings;
