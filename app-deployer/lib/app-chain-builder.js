'use strict';

const path = require('path');
const Promise = require('bluebird');

class AppChainBuilder {

    constructor(params) {
        this._context = params.context;
        this._dirChainBuilder = params.dirChainBuilder;
        this._settingsFileReader = params.settingsFileReader;
    }

    build() {
        return Promise.resolve()
            .then(() => this._buildAppDirChain())
            .then(appDirs => this._loadAppSettings(appDirs))
    }

    _buildAppDirChain() {
        return this._dirChainBuilder.build(
            this._appDir(), this._settingsFilename(), {reverse: true}
        );
    }

    _loadAppSettings(appDirs) {
        return Promise.all(
            appDirs.map(appDir => {
                const settingsFile = path.join(appDir, this._settingsFilename());
                return this._settingsFileReader.read(settingsFile);
            })
        );
    }

    _appDir() {
        return this._context.appDir();
    }

    _settingsFilename() {
        return this._context.settingsFilename();
    }
}

module.exports = AppChainBuilder;
