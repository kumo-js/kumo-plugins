'use strict';

const _ = require('lodash');

class CollectOutputs {

    constructor(params) {
        this._context = params.context;
        this._outputsCollector = params.outputsCollector;
    }

    execute(state) {
        return this._collectOutputs().then(
            outputs => _.assign({}, state, {appOutputs: outputs})
        );
    }

    _collectOutputs() {
        return this._outputsCollector.collect(
            this._context.appDir(),
            this._context.settingsFilename(),
            this._context.env()
        );
    }
}

module.exports = CollectOutputs;
