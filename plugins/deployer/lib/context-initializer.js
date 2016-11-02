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
            context => {
                const env = new Env(context.args.env);
                return Object.assign({}, context, {
                    env: env,
                    generateTempFile: tempfile,
                    moduleDir: path.dirname(context.settingsFile),
                    settings: this._createSettings(context, env)
                })
            }
        );
    }

    _createSettings(context, env) {
        const args = context.args;
        const moduleSettings = context.settings;
        const kumoSettings = context.kumoSettings;
        return new Settings({args, env, kumoSettings, moduleSettings});
    }
}

module.exports = ContextInitializer;
