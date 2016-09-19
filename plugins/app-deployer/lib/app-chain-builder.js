'use strict';

const path = require('path');
const Promise = require('bluebird');
const Settings = require('./settings');

class AppChainBuilder {

    constructor(params) {
        this._context = params.context;
        this._dirChainBuilder = params.dirChainBuilder;
        this._fileReader = params.fileReader;
    }

    build() {
        return Promise.resolve()
            .then(() => this._buildAppDirChain())
            .then(appDirs => this._loadAppSettings(appDirs));
    }

    _buildAppDirChain() {
        return this._dirChainBuilder.build(
            this._appDir(), this._settingsFilename(), {reverse: true}
        );
    }

    _loadAppSettings(appDirs) {
        return Promise.all(appDirs.map(appDir => {
            const settingsFile = path.join(appDir, this._settingsFilename());
            return this._fileReader.readJson(settingsFile)
                .then(settings => this._createSettingsObj(settings))
                .then(settings => ({dir: appDir, settings}));
        }));
    }

    _createSettingsObj(appSettings) {
        return new Settings({
            appSettings: appSettings,
            kumoSettings: this._context.kumoSettings,
            args: this._context.args
        });
    }

    _appDir() {
        return this._context.appDir;
    }

    _settingsFilename() {
        return this._context.settingsFilename;
    }
}

module.exports = AppChainBuilder;
