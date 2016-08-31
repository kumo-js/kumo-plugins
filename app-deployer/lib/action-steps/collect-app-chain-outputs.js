'use strict';

class CollectAppChainOutputs {

    constructor(params) {
        this._context = params.context;
        this._appChainOutputsCollector = params.appChainOutputsCollector;
    }

    execute(state) {
        return this._collectAppChainOutputs().then(
            outputs => Object.assign({}, state, {appChainOutputs: outputs})
        );
    }

    _collectAppChainOutputs() {
        return this._appChainOutputsCollector.collect(
            this._context.appDir(),
            this._context.settingsFilename(),
            this._context.env()
        );
    }
}

module.exports = CollectAppChainOutputs;
