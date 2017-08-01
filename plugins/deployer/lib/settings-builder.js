'use strict';

const _ = require('lodash');
const Settings = require('../../../common-lib/lib/settings');

class SettingsBuilder {

    build(params) {
        const env = params.env;
        const args = params.args;
        const kumoSettings = params.kumoSettings;
        const moduleSettings = params.moduleSettings;
        const rawSettings = this._mergeSettings(kumoSettings, moduleSettings);
        const refData = Object.assign(env.toVars(), {args});
        const settings = new Settings({rawSettings, refData});
        return Promise.resolve(settings);
    }

    _mergeSettings(kumoSettings, moduleSettings) {
        const kumoOutputsStore = _.get(kumoSettings, 'deployer.outputsStore', {});
        const moduleOutputsStore = moduleSettings.outputsStore;
        const outputsStore = Object.assign(kumoOutputsStore, moduleOutputsStore);
        return Object.assign(moduleSettings, {outputsStore});
    }
}

module.exports = SettingsBuilder;
