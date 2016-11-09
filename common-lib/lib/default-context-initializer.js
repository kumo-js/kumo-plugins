'use strict';

const path = require('path');
const searchFiles = require('glob-promise');

class DefaultContextInitializer {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._settingsFileConfig = Object.assign({required: true}, params.settingsFileConfig);
    }

    initialize(context, actionParams) {
        return this._loadSettings(actionParams).then(
            result => Object.assign({}, context, {
                cwd: actionParams.kumoContext.cwd,
                kumoSettings: actionParams.kumoContext.settings,
                logger: actionParams.logger,
                args: actionParams.args,
                settings: result.settings,
                settingsFile: result.settingsFile,
                settingsFilename: path.basename(result.settingsFile)
            })
        );
    }

    _loadSettings(actionParams) {
        return this._findSettingsFile(actionParams).then(settingsFile => {
            const options = {ignoreNotFound: !this._settingsFileConfig.required};
            return this._fileReader.readJson(settingsFile, options)
                .then(settings => settings || {})
                .then(settings => ({settingsFile, settings}));
        });
    }

    _findSettingsFile(actionParams) {
        const cwd = actionParams.kumoContext.cwd;
        const settingsFilename = actionParams.args.settingsFilename;
        const defaultSettingsFilename = this._settingsFileConfig.defaultFilename;
        const searchPattern = path.join(cwd, settingsFilename || (defaultSettingsFilename + '*'));
        return searchFiles(searchPattern).then(files => files[0]);
    }
}

module.exports = DefaultContextInitializer;
