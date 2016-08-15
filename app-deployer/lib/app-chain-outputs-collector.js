'use strict';

const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');

class AppChainOutputsCollector {

    constructor(params) {
        this._dirChainBuilder = params.dirChainBuilder;
        this._outputsStoreFactory = params.outputsStoreFactory;
        this._settingsFileReader = params.settingsFileReader;
    }

    collect(appDir, settingsFilename, env) {
        return Promise.resolve()
            .then(() => this._buildAppDirChain(appDir, settingsFilename))
            .then(appDirs => Promise.all(this._getOutputs(appDirs, settingsFilename, env)))
            .then(outputs => _.flatten(outputs).reduce(_.merge, {}))
    }

    _buildAppDirChain(appDir, settingsFilename) {
        return this._dirChainBuilder.build(appDir, settingsFilename, {reverse: true});
    }

    _getOutputs(appDirs, settingsFilename, env) {
        return appDirs.map(appDir => this._getAppOutputs(appDir, settingsFilename, env));
    }

    _getAppOutputs(appDir, settingsFilename, env) {
        const settingsFile = path.join(appDir, settingsFilename);
        return this._settingsFileReader.read(settingsFile).then(settings => {
            const envs = _.compact([env.prefix(), env.value()]);
            return Promise.all(envs.map(env => this._outputsStore(settings, env).collect()));
        });
    }

    _outputsStore(settings, env) {
        return this._outputsStoreFactory.createStore(settings, env);
    }
}

module.exports = AppChainOutputsCollector;
