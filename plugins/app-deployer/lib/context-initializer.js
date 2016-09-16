'use strict';

const path = require('path');
const tempfile = require('tempfile2');
const Env = require('./env');
const Settings = require('./settings');

class ContextInitializer {

    constructor(params) {
        this._defaultContextInitializer = params.defaultContextInitializer;
    }

    initialize(context, actionParams) {
        return this._defaultContextInitializer.initialize(context, actionParams).then(
            context => Object.assign({}, context, {
                appDir: path.dirname(context.settingsFile),
                env: new Env(context.options.env),
                generateTempFile: tempfile,
                settings: this._wrapSettings(context)
            })
        );
    }

    _wrapSettings(context) {
        const pluginSettings = context.settings;
        const kumoSettings = context.kumoSettings;
        const options = context.options;
        return new Settings({pluginSettings, kumoSettings, options});
    }
}

module.exports = ContextInitializer;
