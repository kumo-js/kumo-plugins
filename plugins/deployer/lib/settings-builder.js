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
        return this._derefSettings(settings, args, env);
    }

    _mergeSettings(kumoSettings, moduleSettings) {
        const kumoOutputsStore = _.get(kumoSettings, 'deployer.outputsStore', {});
        const moduleOutputsStore = moduleSettings.outputsStore;
        const outputsStore = Object.assign(kumoOutputsStore, moduleOutputsStore);
        return Object.assign(moduleSettings, {outputsStore});
    }

    _derefSettings(settings, args, env) {
        // TODO: camelCase args
        const refData = Object.assign(env.toVars(), {args});
        return this._jsonSchemaHelper.derefWith(settings, refData);
    }
}

module.exports = SettingsBuilder;
