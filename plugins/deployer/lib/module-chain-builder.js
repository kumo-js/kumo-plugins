'use strict';

const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');

class ModuleChainBuilder {

    constructor(params) {
        this._context = params.context;
        this._dirChainBuilder = params.dirChainBuilder;
        this._fileReader = params.fileReader;
        this._settingsBuilder = params.settingsBuilder;
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
            return this._fileReader.readAsObject(settingsFile)
                .then(moduleSettings => this._buildSettings(moduleSettings))
                .then(settings => ({dir: moduleDir, settings}));
        }));
    }

    _buildSettings(moduleSettings) {
        var params = _.pick(this._context, ['args', 'env', 'kumoSettings']);
        params = Object.assign(params, {moduleSettings});
        return this._settingsBuilder.build(params);
    }

    _currentModuleDir() {
        return this._context.moduleDir;
    }

    _settingsFilename() {
        return this._context.settingsFilename;
    }
}

module.exports = ModuleChainBuilder;
