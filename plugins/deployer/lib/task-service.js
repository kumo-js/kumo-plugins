'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class TaskService {

    constructor(params) {
        this._logger = params.logger;
        this._outputsStore = params.outputsStore;
        this._taskFactory = params.taskFactory;
    }

    executeTask(params) {
        const taskId = params.taskDef.id;
        this._logger.info(`\n--->Executing task: ${taskId}`);

        return Promise.resolve()
            .then(() => this._taskFactory.createTask(params).execute())
            .then(taskResult => _.get(taskResult, 'outputs', {}))
            .then(outputs => this._outputsStore.save(taskId, outputs).then(() => outputs));
    }

    undoTask(params) {
        const taskId = params.taskDef.id;
        this._logger.info(`\n--->Undoing task: ${taskId}`);

        return Promise.resolve()
            .then(() => this._taskFactory.createUndoTask(params).execute())
            .then(() => this._outputsStore.remove(taskId));
    }
}

module.exports = TaskService;
