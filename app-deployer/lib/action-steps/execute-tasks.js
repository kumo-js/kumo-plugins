'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class ExecuteTasks {

    constructor(params) {
        this._taskExecutor = params.taskExecutor;
    }

    execute(state) {
        return this._executeTasks(state).then(
            outputs => _.assign({}, state, {appChainOutputs: outputs})
        );
    }

    _executeTasks(state) {
        return state.taskDefs.reduce((promise, taskDef) => {
            return promise.then(outputs => this._taskExecutor.execute(taskDef, outputs));
        }, Promise.resolve(state.appChainOutputs));
    }
}

module.exports = ExecuteTasks;
