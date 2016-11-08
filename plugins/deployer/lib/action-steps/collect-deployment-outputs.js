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
            .then(modules => this._collectAllOutputs(modules))
            .then(outputs => Object.assign({}, state, {deploymentOutputs: outputs}));
    }

    _collectAllOutputs(modules) {
        const promises = modules.map(module => this._collectModuleOutputs(module));
        return Promise.all(promises).then(outputs => outputs.reduce(_.merge, {}));
    }

    _collectModuleOutputs(module) {
        const settings = module.settings;
        const moduleName = settings.moduleName;
        const envNamespaces = this._context.env.namespaces();
        const promises = envNamespaces.map(
            envNamespace => this._outputsStore(settings, envNamespace).collect()
        );
        return Promise.all(promises).then(outputs =>
            outputs.reduce((result, output) =>
                _.merge(result, {[moduleName]: output}), {}
            )
        );
    }

    _outputsStore(settings, envNamespace) {
        return this._outputsStoreFactory.createStore(settings, envNamespace);
    }
}

module.exports = CollectDeploymentOutputs;
