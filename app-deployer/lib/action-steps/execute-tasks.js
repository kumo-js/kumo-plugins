'use strict';

const Promise = require('bluebird');

class ExecuteTasks {

    constructor(params) {
        this._taskExecutor = params.taskExecutor;
    }

    execute(state) {
        return this._executeTasks(state).then(appChainOutputs =>
            Object.assign({}, state, {appChainOutputs: appChainOutputs})
        );
    }

    _executeTasks(state) {
        const config = state.config;
        return state.taskDefs.reduce((promise, taskDef) => {
            return promise.then(appChainOutputs =>
                this._taskExecutor.execute({taskDef, appChainOutputs, config})
            );
        }, Promise.resolve(state.appChainOutputs));
    }
}

module.exports = ExecuteTasks;
