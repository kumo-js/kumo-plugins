'use strict';

const path = require('path');

class DefaultContextInitializer {

    constructor(params) {
        this._defaultSettingsFilename = params.defaultSettingsFilename;
        this._fileReader = params.fileReader;
    }

    initialize(context, actionParams) {
        return this._loadSettings(actionParams).then(
            result => Object.assign({}, context, {
                cwd: actionParams.kumoContext.cwd,
                kumoSettings: actionParams.kumoContext.settings,
                logger: actionParams.logger,
                options: actionParams.options,
                settings: result.settings,
                settingsFile: result.settingsFile,
                settingsFilename: path.basename(result.settingsFile)
            })
        );
    }

    _loadSettings(actionParams) {
        const settingsFile = this._settingsFile(actionParams);
        return this._fileReader.readJson(settingsFile).then(
            settings => ({settingsFile, settings})
        );
    }

    _settingsFile(actionParams) {
        const cwd = actionParams.kumoContext.cwd;
        const filename = actionParams.options.settingsFilename || this._defaultSettingsFilename;
        return path.join(cwd, filename);
    }
}

module.exports = DefaultContextInitializer;
