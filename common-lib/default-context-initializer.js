'use strict';

const path = require('path');

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
        const settingsFile = this._settingsFile(actionParams);
        const options = {ignoreNotFound: !this._settingsFileConfig.required};
        return this._fileReader.readJson(settingsFile, options)
            .then(settings => settings || {})
            .then(settings => ({settingsFile, settings}));
    }

    _settingsFile(actionParams) {
        const cwd = actionParams.kumoContext.cwd;
        const settingsFilename = actionParams.args.settingsFilename;
        const defaultSettingsFilename = this._settingsFileConfig.defaultFilename;
        return path.join(cwd, settingsFilename || defaultSettingsFilename);
    }
}

module.exports = DefaultContextInitializer;
