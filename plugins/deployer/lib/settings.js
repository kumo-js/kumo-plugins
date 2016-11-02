'use strict';

const _ = require('lodash');

class Settings {

    constructor(params) {
        this._args = params.args;
        this._env = params.env;
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
        const defaultBucket = _.get(this._kumoSettings, 'deployer.outputsBucket', {});
        const outputsBucket = _.merge(defaultBucket, this._moduleSettings.outputsBucket);
        const name = this._expandBucketName(outputsBucket.name);
        return Object.assign({region: defaultRegion}, outputsBucket, {name});
    }

    _expandBucketName(name) {
        const level = name.appendEnvNamespaceLevel;
        const envNamespace = level ? `-${this._env.namespaceAtLevel(level)}` : '';
        return name.value + envNamespace;
    }
}

module.exports = Settings;
