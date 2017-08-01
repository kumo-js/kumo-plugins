'use strict';

class InitialiseOutputsStore {

    constructor(params) {
        this._context = params.context;
        this._outputsStoreFactory = params.outputsStoreFactory;
    }

    execute(state) {
        return this._resolveOutputsStoreDef()
            .then(storeDef => this._outputsStoreFactory.createStore(storeDef))
            .then(store => store.initialise().then(() => store))
            .then(store => Object.assign({}, state, {outputsStore: store}));
    }

    _resolveOutputsStoreDef() {
        return this._context.settings.resolve('outputsStore');
    }
}

module.exports = InitialiseOutputsStore;
