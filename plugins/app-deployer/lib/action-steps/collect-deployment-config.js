'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CollectDeploymentConfig {

    constructor(params) {
        this._appChainBuilder = params.appChainBuilder;
        this._context = params.context;
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(state) {
        return this._appChainBuilder.build()
            .then(appChain => this._collectAllConfig(appChain))
            .then(config => Object.assign({}, state, {deploymentConfig: config}));
    }

    _collectAllConfig(appChain) {
        const promises = appChain.map(app => this._collectAppConfig(app));
        return Promise.all(promises).then(config => config.reduce(_.merge, {}));
    }

    _collectAppConfig(app) {
        const configScript = _.get(app.settings.config(), 'script');
        if (!configScript) return Promise.resolve({});
        const envVars = {env: this._context.env.value()};
        const scriptOptions = {cwd: app.dir, env: envVars, logOutput: false};
        return this._scriptExecutor.execute(configScript, scriptOptions).then(JSON.parse);
    }
}

module.exports = CollectDeploymentConfig;
