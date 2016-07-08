'use strict';

const path = require('path');
const tempfile = require('tempfile2');
const Env = require('./env');

class PluginContext {

    constructor(params) {
        this._fs = params.fs;
        this._kumoContext = params.kumoContext;
        this._options = params.options;
        this._settingsReader = params.settingsReader;
    }

    env() {
        // Default to current user??
        return new Env(this._options.env);
    }

    appDir() {
        return path.dirname(this.settingsFile());
    }

    settings() {
        return this._settings = this._settings ||
            this._settingsReader.readSync(this.settingsFile());
    }

    settingsFile() {
        // Do we need to search up the dir chain ??
        return path.join(this._cwd(), this.settingsFilename());
    }

    settingsFilename() {
        return 'app-settings.json'
    }

    tempFile() {
        return tempfile();
    }

    _cwd() {
        return this._kumoContext.cwd();
    }
}

module.exports = PluginContext;
