'use strict';

const _ = require('lodash');

class SettingsBuilder {

    constructor(params) {
        this._jsonSchemaHelper = params.jsonSchemaHelper;
    }

    build(params) {
        const args = params.args;
        const env = params.env;
        const kumoSettings = params.kumoSettings;
        const moduleSettings = params.moduleSettings;
        const settings = this._mergeSettings(kumoSettings, moduleSettings);

        return this._derefSettings(settings, args, env).then(
            settings => this._setOutputsBucket(settings, args)
        );
    }

    _mergeSettings(kumoSettings, moduleSettings) {
        const kumoOutputsBucket = _.get(kumoSettings, 'deployer.outputsBucket', {});
        const moduleOutputsBucket = moduleSettings.outputsBucket;
        const outputsBucket = Object.assign(kumoOutputsBucket, moduleOutputsBucket);
        return Object.assign(moduleSettings, {outputsBucket})
    }

    _derefSettings(settings, args, env) {
        const refData = Object.assign(env.toVars(), {args});
        return this._jsonSchemaHelper.derefWith(settings, refData)
    }

    _setOutputsBucket(settings, args) {
        const region = args.region;
        const name = this._expandBucketName(settings.outputsBucket.name);
        const outputsBucket = Object.assign({}, settings.outputsBucket, {region, name});
        return Object.assign(settings, {outputsBucket});
    }

    _expandBucketName(name) {
        return _.isArray(name) ? name.join('-') : name;
    }
}

module.exports = SettingsBuilder;
