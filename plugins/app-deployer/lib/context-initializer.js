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
                env: new Env(context.args.env),
                generateTempFile: tempfile,
                settings: this._wrapSettings(context)
            })
        );
    }

    _wrapSettings(context) {
        const appSettings = context.settings;
        const kumoSettings = context.kumoSettings;
        const args = context.args;
        return new Settings({appSettings, kumoSettings, args});
    }
}

module.exports = ContextInitializer;
