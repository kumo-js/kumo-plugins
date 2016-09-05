'use strict';

class UndoTasks {

    constructor(params) {
        this._taskUndoer = params.taskUndoer;
    }

    execute(state) {
        return this._undoTasks(state).then(() => state);
    }

    _undoTasks(state) {
        const appChainConfig = state.appChainConfig;
        const appChainOutputs = state.appChainOutputs;
        return state.taskDefs.reverse().reduce((promise, taskDef) => {
            const params = {taskDef, appChainOutputs, appChainConfig};
            return promise.then(() => this._taskUndoer.undo(params));
        }, Promise.resolve());
    }
}

module.exports = UndoTasks;
