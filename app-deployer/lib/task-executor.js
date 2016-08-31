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
            .then(() => this._createTask(params).execute())
            .then(taskResult => this._extractOutputs(taskResult))
            .then(outputs => this._outputsStore().save(taskId, outputs))
            .then(outputs => Object.assign({}, params.appChainOutputs, outputs));
    }

    _createTask(params) {
        const appChainOutputs = params.appChainOutputs;
        const appOutputs = _.get(appChainOutputs, this._appNamespace(), {});
        params = Object.assign({}, params, {appOutputs});
        return this._taskFactory.createTask(params);
    }

    _extractOutputs(taskResult) {
        const outputs = _.get(taskResult, 'outputs', {});
        return {[this._appNamespace()]: outputs};
    }

    _appNamespace() {
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