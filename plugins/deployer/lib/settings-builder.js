'use strict';

const _ = require('lodash');

class SettingsBuilder {

    constructor(params) {
        this._jsonSchemaHelper = params.jsonSchemaHelper;
    }

    build(params) {
        const args = params.args;
        const kumoSettings = params.kumoSettings;

        return this._derefModuleSettings(params).then(
            moduleSettings => this._setOutputsBucket(moduleSettings, kumoSettings, args)
        );
    }

    _derefModuleSettings(params) {
        const refData = Object.assign({args: params.args}, params.env.toVars());
        return this._jsonSchemaHelper.derefWith(params.moduleSettings, refData)
    }

    _setOutputsBucket(moduleSettings, kumoSettings, args) {
        const defaultRegion = args.region;
        const defaultBucketSettings = _.get(kumoSettings, 'deployer.outputsBucket', {});
        const mergedBucketSettings = _.merge(defaultBucketSettings, moduleSettings.outputsBucket);
        const name = this._expandBucketName(mergedBucketSettings.name);
        const outputsBucket = Object.assign({region: defaultRegion}, mergedBucketSettings, {name});
        return Object.assign(moduleSettings, {outputsBucket});
    }

    _expandBucketName(name) {
        return _.isArray(name) ? name.join('-') : name;
    }
}

module.exports = SettingsBuilder;
