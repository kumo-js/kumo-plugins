'use strict';

const Promise = require('bluebird');

class ExecuteTasks {

    constructor(params) {
        this._context = params.context;
        this._taskService = params.taskService;
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
                this._executeTask({taskDef, appChainConfig, appChainOutputs})
            );
        }, Promise.resolve(state.appChainOutputs));
    }

    _executeTask(params) {
        const appName = this._context.settings.appName();
        return this._taskService.executeTask(params).then(outputs =>
            Object.assign({}, params.appChainOutputs, {[appName]: outputs})
        );
    }
}

module.exports = ExecuteTasks;
