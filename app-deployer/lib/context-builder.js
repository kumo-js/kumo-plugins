'use strict';

const path = require('path');
const tempfile = require('tempfile2');
const Env = require('./env');

class ContextBuilder {

    constructor(params) {
        this._kumoContext = params.kumoContext;
        this._logger = params.logger;
        this._options = params.options;
        this._settingsFileReader = params.settingsFileReader;
    }

    build() {
        return this._readSettings().then(settings => ({
            appDir: this._appDir(),
            env: this._env(),
            kumoContext: this._kumoContext,
            logger: this._logger,
            options: this._options,
            settings: settings,
            settingsFilename: this._settingsFilename(),
            generateTempFile: tempfile
        }));
    }

    _env() {
        return new Env(this._options.env);
    }

    _appDir() {
        return this._kumoContext.cwd();
    }

    _readSettings() {
        return this._settingsFileReader.read(this._settingsFile());
    }

    _settingsFile() {
        return path.join(this._appDir(), this._settingsFilename());
    }

    _settingsFilename() {
        return this._options.settingsFilename || 'deploy-settings.json';
    }
}

module.exports = ContextBuilder;
