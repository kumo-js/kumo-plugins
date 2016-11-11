'use strict';

const path = require('path');
const searchFiles = require('glob-promise');

class DefaultContextInitializer {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._settingsFileConfig = Object.assign({required: true}, params.settingsFileConfig);
    }

    initialize(context, actionParams) {
        const state = {context, actionParams};
        return Promise.resolve(state)
            .then(state => this._findSettingsFile(state))
            .then(state => this._loadSettingsIfNecessary(state))
            .then(state => this._buildNewContext(state))
            .then(state => state.newContext);
    }

    _loadSettingsIfNecessary(state) {
        const settingsFile = state.settingsFile;
        if (!settingsFile) return Promise.resolve(state);

        const options = {ignoreNotFound: !this._settingsFileConfig.required};
        return this._fileReader.readJson(settingsFile, options)
            .then(settings => Object.assign({}, state, {
                settingsVars: {
                    settings: settings,
                    settingsFile: settingsFile,
                    settingsFilename: path.basename(settingsFile)
                }
            }));
    }

    _findSettingsFile(state) {
        const actionParams = state.actionParams;
        const cwd = actionParams.kumoContext.cwd;
        const settingsFilename = actionParams.args.settingsFilename;
        const defaultSettingsFilename = this._settingsFileConfig.defaultFilename;
        const searchPattern = path.join(cwd, settingsFilename || (defaultSettingsFilename + '*'));
        return searchFiles(searchPattern)
            .then(files => Object.assign({}, state, {settingsFile: files[0]}));
    }

    _buildNewContext(state) {
        const actionParams = state.actionParams;
        const newContext = Object.assign({}, state.context, state.settingsVars, {
            cwd: actionParams.kumoContext.cwd,
            kumoSettings: actionParams.kumoContext.settings,
            logger: actionParams.logger,
            args: actionParams.args
        });
        return Object.assign({}, state, {newContext});
    }

}

module.exports = DefaultContextInitializer;
