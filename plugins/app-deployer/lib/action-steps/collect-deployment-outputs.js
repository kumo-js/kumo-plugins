'use strict';

const _ = require('lodash');

class CollectDeploymentOutputs {

    constructor(params) {
        this._appChainBuilder = params.appChainBuilder;
        this._context = params.context;
        this._outputsStoreFactory = params.outputsStoreFactory;
    }

    execute(state) {
        return this._appChainBuilder.build()
            .then(appChain => this._collectAllOutputs(appChain))
            .then(outputs => Object.assign({}, state, {deploymentOutputs: outputs}));
    }

    _collectAllOutputs(appChain) {
        const promises = appChain.map(app => this._collectAppOutputs(app));
        return Promise.all(promises).then(outputs => outputs.reduce(_.merge, {}));
    }

    _collectAppOutputs(app) {
        const settings = app.settings;
        const appName = settings.appName();
        const envs = this._envs();
        const promises = envs.map(env => this._outputsStore(settings, env).collect());

        return Promise.all(promises).then(outputs =>
            outputs.reduce((result, output) =>
                _.merge(result, {[appName]: output}), {}
            )
        );
    }

    _envs() {
        const env = this._context.env;
        return _.compact([env.prefix(), env.value()]);
    }

    _outputsStore(settings, env) {
        return this._outputsStoreFactory.createStore(settings, env);
    }
}

module.exports = CollectDeploymentOutputs;
