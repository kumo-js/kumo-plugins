'use strict';

const path = require('path');
const Promise = require('bluebird');
const Settings = require('./settings');

class ModuleChainBuilder {

    constructor(params) {
        this._context = params.context;
        this._dirChainBuilder = params.dirChainBuilder;
        this._fileReader = params.fileReader;
    }

    build() {
        return Promise.resolve()
            .then(() => this._getModuleDirs())
            .then(moduleDirs => this._loadModules(moduleDirs));
    }

    _getModuleDirs() {
        return this._dirChainBuilder.build(
            this._currentModuleDir(), this._settingsFilename(), {reverse: true}
        );
    }

    _loadModules(moduleDirs) {
        return Promise.all(moduleDirs.map(moduleDir => {
            const settingsFile = path.join(moduleDir, this._settingsFilename());
            return this._fileReader.readJson(settingsFile)
                .then(settings => this._createSettingsObj(settings))
                .then(settings => ({dir: moduleDir, settings}));
        }));
    }

    _createSettingsObj(moduleSettings) {
        return new Settings({
            args: this._context.args,
            env: this._context.env,
            kumoSettings: this._context.kumoSettings,
            moduleSettings: moduleSettings
        });
    }

    _currentModuleDir() {
        return this._context.moduleDir;
    }

    _settingsFilename() {
        return this._context.settingsFilename;
    }
}

module.exports = ModuleChainBuilder;
