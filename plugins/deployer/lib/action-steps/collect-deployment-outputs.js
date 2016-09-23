'use strict';

const _ = require('lodash');

class CollectDeploymentOutputs {

    constructor(params) {
        this._context = params.context;
        this._moduleChainBuilder = params.moduleChainBuilder;
        this._outputsStoreFactory = params.outputsStoreFactory;
    }

    execute(state) {
        return this._moduleChainBuilder.build()
            .then(modules => this._collectOutputs(modules))
            .then(outputs => Object.assign({}, state, {deploymentOutputs: outputs}));
    }

    _collectOutputs(modules) {
        const promises = modules.map(module => this._collectOutput(module));
        return Promise.all(promises).then(outputs => outputs.reduce(_.merge, {}));
    }

    _collectOutput(module) {
        const settings = module.settings;
        const moduleName = settings.moduleName();
        const promises = this._envs().map(env => this._outputsStore(settings, env).collect());

        return Promise.all(promises).then(outputs =>
            outputs.reduce((result, output) =>
                _.merge(result, {[moduleName]: output}), {}
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
