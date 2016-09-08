'use strict';

const Settings = require('./settings');

class SettingsFileReader {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._kumoSettings = params.kumoSettings;
        this._options = params.options;
    }

    read(file) {
        return this._fileReader.readJson(file).then(
            deploySettings => this._createSettings(deploySettings)
        );
    }

    _createSettings(deploySettings) {
        return new Settings({
            deploySettings: deploySettings,
            kumoSettings: this._kumoSettings,
            options: this._options
        });
    }
}

module.exports = SettingsFileReader;
