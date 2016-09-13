'use strict';

const Promise = require('bluebird');

class TaskUndoer {

    constructor(params) {
        this._context = params.context;
        this._logger = this._context.logger;
        this._outputsStoreFactory = params.outputsStoreFactory;
        this._taskFactory = params.taskFactory;
    }

    undo(params) {
        const taskId = params.taskDef.id;
        this._logger.info(`\n--->Undoing task: ${taskId}`);

        return Promise.resolve()
            .then(() => this._undoTask(params))
            .then(() => this._outputsStore().remove(taskId));
    }

    _undoTask(params) {
        return this._taskFactory.createUndoTask(params).execute();
    }

    _outputsStore() {
        return this._outputsStoreFactory.createStore(
            this._context.settings,
            this._context.env.value()
        );
    }
}

module.exports = TaskUndoer;
