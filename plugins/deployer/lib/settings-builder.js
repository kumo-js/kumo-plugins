'use strict';

const _ = require('lodash');
const PluginSettings = require('../../../common-lib/lib/plugin-settings');

class SettingsBuilder {

    build(params) {
        const env = params.env;
        const args = params.args;
        const kumoSettings = params.kumoSettings;
        const moduleSettings = params.moduleSettings;
        const settings = this._mergeSettings(kumoSettings, moduleSettings);
        const refData = Object.assign(env.toVars(), {args});
        const pluginSettings = new PluginSettings({settings, refData});
        return Promise.resolve(pluginSettings);
    }

    _mergeSettings(kumoSettings, moduleSettings) {
        const kumoOutputsStore = _.get(kumoSettings, 'deployer.outputsStore', {});
        const moduleOutputsStore = moduleSettings.outputsStore;
        const outputsStore = Object.assign(kumoOutputsStore, moduleOutputsStore);
        return Object.assign(moduleSettings, {outputsStore});
    }
}

module.exports = SettingsBuilder;
