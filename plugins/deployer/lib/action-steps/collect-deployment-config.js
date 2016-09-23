'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CollectDeploymentConfig {

    constructor(params) {
        this._context = params.context;
        this._moduleChainBuilder = params.moduleChainBuilder;
        this._scriptExecutor = params.scriptExecutor;
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
        const configScript = _.get(module.settings.config(), 'script');
        if (!configScript) return Promise.resolve({});
        const envVars = {env: this._context.env.value()};
        const scriptOptions = {cwd: module.dir, env: envVars, logOutput: false};
        return this._scriptExecutor.execute(configScript, scriptOptions).then(JSON.parse);
    }
}

module.exports = CollectDeploymentConfig;
