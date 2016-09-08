'use strict';

const ContextBuilder = require('./context-builder');
const FileReader = require('../../common-lib/json-compatible-file-reader');
const SettingsFileReader = require('./settings-file-reader');

class ContextBuilderFactory {

    createBuilder(params) {
        const settingsFileReader = this._settingsFileReader(params);
        params = Object.assign({settingsFileReader}, params);
        return new ContextBuilder(params);
    }

    _settingsFileReader(params) {
        const fileReader = new FileReader();
        const kumoSettings = params.kumoContext.settings();
        const options = params.options;
        return new SettingsFileReader({fileReader, kumoSettings, options});
    }
}

module.exports = ContextBuilderFactory;
