'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CollectDeploymentConfig {

    constructor(params) {
        this._context = params.context;
        this._envVarsFormatter = params.envVarsFormatter;
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
        const script = _.get(module.settings.config(), 'script');
        if (!script) return Promise.resolve({});
        const envVars = this._getConfigScriptEnvVars();
        const scriptOptions = {cwd: module.dir, envVars, logOutput: false};
        return this._scriptExecutor.execute(script, scriptOptions).then(JSON.parse);
    }

    _getConfigScriptEnvVars() {
        const envVars = this._context.env.toVars();
        return this._envVarsFormatter.format(envVars);
    }
}

module.exports = CollectDeploymentConfig;
