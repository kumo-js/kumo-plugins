'use strict';

const Promise = require('bluebird');
const Settings = require('./settings');

class SettingsFileReader {

    constructor(params) {
        this._fs = Promise.promisifyAll(params.fs);
        this._kumoSettings = params.kumoSettings;
        this._options = params.options;
    }

    read(file) {
        return this._fs.readFileAsync(file).then(
            deploySettings => this._createSettings(deploySettings)
        );
    }

    readSync(file) {
        const deploySettings = this._fs.readFileSync(file);
        return this._createSettings(deploySettings);
    }

    _createSettings(deploySettings) {
        deploySettings = JSON.parse(deploySettings);
        return new Settings({
            deploySettings: deploySettings,
            kumoSettings: this._kumoSettings,
            options: this._options
        });
    }
}

module.exports = SettingsFileReader;
