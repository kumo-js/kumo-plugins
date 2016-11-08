'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CollectDeploymentConfig {

    constructor(params) {
        this._context = params.context;
        this._deploymentScriptExecutor = params.deploymentScriptExecutor;
        this._moduleChainBuilder = params.moduleChainBuilder;
    }

    execute(state) {
        return this._moduleChainBuilder.build()
            .then(modules => this._collectConfigs(modules))
            .then(config => Object.assign({}, state, {deploymentConfig: config}));
    }

    _collectConfigs(modules) {
        const promises = modules.map(module => this._collectConfig(module));
        return Promise.all(promises).then(config => config.reduce(_.merge, {}));
    }

    _collectConfig(module) {
        const configScriptDef = _.get(module.settings, 'config');
        if (!configScriptDef) return Promise.resolve({});
        const options = {cwd: module.dir, logOutput: false};
        return this._deploymentScriptExecutor.execute(configScriptDef, options).then(JSON.parse);
    }
}

module.exports = CollectDeploymentConfig;
