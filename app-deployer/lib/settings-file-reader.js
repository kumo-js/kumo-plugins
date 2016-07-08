'use strict';

const Promise = require('bluebird');
const Settings = require('./settings');

class SettingsFileReader {

    constructor(params) {
        this._fs = Promise.promisifyAll(params.fs);
        this._kumoSettings = params.kumoSettings;
    }

    read(file) {
        return this._fs.readFileAsync(file).then(
            rawSettings => this._createSettings(rawSettings)
        );
    }

    readSync(file) {
        const rawSettings = this._fs.readFileSync(file);
        return this._createSettings(rawSettings);
    }

    _createSettings(rawSettings) {
        rawSettings = JSON.parse(rawSettings);
        return new Settings({
            rawSettings: rawSettings,
            kumoSettings: this._kumoSettings
        });
    }
}

module.exports = SettingsFileReader;
