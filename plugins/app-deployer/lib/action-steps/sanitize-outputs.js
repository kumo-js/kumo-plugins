'use strict';

class SanitizeOutputs {

    constructor(params) {
        this._context = params.context;
        this._outputsStoreFactory = params.outputsStoreFactory;
    }

    execute(state) {
        return Promise.resolve()
            .then(() => state.taskDefs.map(t => t.id))
            .then(taskIds => this._outputsStore().removeAllExcept(taskIds))
            .then(() => state);
    }

    _outputsStore() {
        return this._outputsStoreFactory.createStore(
            this._context.settings,
            this._context.env.value()
        );
    }
}

module.exports = SanitizeOutputs;
