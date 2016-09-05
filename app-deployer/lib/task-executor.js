'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class TaskExecutor {

    constructor(params) {
        this._context = params.context;
        this._logger = this._context.logger();
        this._outputsStoreFactory = params.outputsStoreFactory;
        this._taskFactory = params.taskFactory;
    }

    execute(params) {
        const taskId = params.taskDef.id;
        this._logger.info(`\n--->Executing task: ${taskId}`);

        return Promise.resolve()
            .then(() => this._executeTask(params))
            .then(taskResult => _.get(taskResult, 'outputs', {}))
            .then(outputs => this._saveOutputs(taskId, outputs))
            .then(outputs => this._mergeOutputs(params.appChainOutputs, outputs));
    }

    _executeTask(params) {
        return this._taskFactory.createTask(params).execute();
    }

    _saveOutputs(taskId, outputs) {
        return this._outputsStore().save(taskId, outputs).then(() => outputs);
    }

    _mergeOutputs(source, outputs) {
        return Object.assign({}, source, {[this._appName()]: outputs});
    }

    _appName() {
        return this._context.settings().appName();
    }

    _outputsStore() {
        return this._outputsStoreFactory.createStore(
            this._context.settings(),
            this._context.env().value()
        );
    }
}

module.exports = TaskExecutor;
