'use strict';

class InitialiseOutputsStore {

    constructor(params) {
        this._context = params.context;
        this._objectResolver = params.objectResolver;
        this._outputsStoreFactory = params.outputsStoreFactory;
    }

    execute(state) {
        const refData = {deploymentConfig: state.deploymentConfig};
        const storeDef = this._context.settings.outputsStore || {};
        return this._objectResolver.resolve(storeDef, refData)
            .then(storeDef => this._outputsStoreFactory.createStore(storeDef))
            .then(store => store.initialise().then(() => store))
            .then(store => Object.assign({}, state, {outputsStore: store}));
    }

}

module.exports = InitialiseOutputsStore;
