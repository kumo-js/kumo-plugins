'use strict';

const Promise = require('bluebird');

class StepsExecutor {

    constructor(params) {
        this._initialState = params.initialState || {};
        this._steps = params.steps;
    }

    execute() {
        return this._steps.reduce(
            (promise, step) => promise.then(state => step.execute(state)),
            Promise.resolve(this._initialState)
        );
    }
}

module.exports = StepsExecutor;
