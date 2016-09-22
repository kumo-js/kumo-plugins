'use strict';

class UndoTasks {

    constructor(params) {
        this._taskService = params.taskService;
    }

    execute(state) {
        return this._undoTasks(state).then(() => state);
    }

    _undoTasks(state) {
        const appChainConfig = state.appChainConfig;
        const appChainOutputs = state.appChainOutputs;
        return state.taskDefs.reverse().reduce((promise, taskDef) => {
            const params = {taskDef, appChainConfig, appChainOutputs};
            return promise.then(() => this._taskService.undoTask(params));
        }, Promise.resolve());
    }
}

module.exports = UndoTasks;
