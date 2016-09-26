'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class TaskService {

    constructor(params) {
        this._context = params.context;
        this._logger = this._context.logger;
        this._outputsStoreFactory = params.outputsStoreFactory;
        this._taskFactory = params.taskFactory;
    }

    executeTask(params) {
        const taskId = params.taskDef.id;
        this._logger.info(`\n--->Executing task: ${taskId}`);

        return Promise.resolve()
            .then(() => this._taskFactory.createTask(params).execute())
            .then(taskResult => _.get(taskResult, 'outputs', {}))
            .then(outputs => this._saveOutputs(taskId, outputs));
    }

    undoTask(params) {
        const taskId = params.taskDef.id;
        this._logger.info(`\n--->Undoing task: ${taskId}`);

        return Promise.resolve()
            .then(() => this._taskFactory.createUndoTask(params).execute())
            .then(() => this._outputsStore().remove(taskId));
    }

    _saveOutputs(taskId, outputs) {
        return this._outputsStore().save(taskId, outputs).then(() => outputs);
    }

    _outputsStore() {
        return this._outputsStoreFactory.createStore(
            this._context.settings,
            this._context.env.value()
        );
    }
}

module.exports = TaskService;
