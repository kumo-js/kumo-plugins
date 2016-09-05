'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CollectAppChainConfig {

    constructor(params) {
        this._appChainBuilder = params.appChainBuilder;
        this._context = params.context;
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(state) {
        return this._appChainBuilder.build()
            .then(appChain => this._collectAppChainConfig(appChain))
            .then(config => Object.assign({}, state, {appChainConfig: config}));
    }

    _collectAppChainConfig(appChain) {
        const promises = appChain.map(app => this._collectAppConfig(app));
        return Promise.all(promises).then(config => config.reduce(_.merge, {}));
    }

    _collectAppConfig(settings) {
        const appName = settings.appName();
        const script = _.get(settings.config(), 'script');
        if (!script) return Promise.resolve({});
        const envVars = {env: this._context.env().value()};
        const scriptOptions = {env: envVars, logOutput: false};
        return this._scriptExecutor.execute(script, scriptOptions)
            .then(jsonConfigStr => JSON.parse(jsonConfigStr || '{}'))
            .then(jsonConfig => ({[appName]: jsonConfig}));
    }
}

module.exports = CollectAppChainConfig;
