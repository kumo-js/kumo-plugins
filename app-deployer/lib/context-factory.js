'use strict';

const path = require('path');
const tempfile = require('tempfile2');
const Env = require('./env');
const Settings = require('./settings');

class ContextFactory {

    constructor(params) {
        this._fileReader = params.fileReader;
    }

    createContext(params) {
        return this._loadSettings(params).then(result => ({
            appDir: path.dirname(result.settingsFile),
            env: new Env(params.options.env),
            kumoSettings: params.kumoContext.settings,
            logger: params.logger,
            options: params.options,
            settings: result.settings,
            settingsFilename: path.basename(result.settingsFile),
            generateTempFile: tempfile
        }));
    }

    _loadSettings(params) {
        const settingsFile = this._settingsFile(params);
        const kumoSettings = params.kumoContext.settings;
        const options = params.options;
        return this._fileReader.readJson(settingsFile)
            .then(appSettings => new Settings({appSettings, kumoSettings, options}))
            .then(settings => ({settingsFile, settings}));
    }

    _settingsFile(params) {
        const filename = params.options.settingsFilename || 'deploy-settings.json';
        return path.join(params.kumoContext.cwd, filename);
    }
}

module.exports = ContextFactory;
