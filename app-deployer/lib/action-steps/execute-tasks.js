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
        const appChainConfig = state.appChainConfig;
        return state.taskDefs.reduce((promise, taskDef) => {
            return promise.then(appChainOutputs =>
                this._taskExecutor.execute({taskDef, appChainOutputs, appChainConfig})
            );
        }, Promise.resolve(state.appChainOutputs));
    }
}

module.exports = ExecuteTasks;
