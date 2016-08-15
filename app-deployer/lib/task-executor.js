'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class TaskExecutor {

    constructor(params) {
        this._context = params.context;
        this._outputsStoreFactory = params.outputsStoreFactory;
        this._taskFactory = params.taskFactory;
    }

    execute(taskDef, appChainOutputs) {
        return Promise.resolve()
            .then(() => this._executeTask(taskDef, appChainOutputs))
            .then(taskResult => this._extractAppOutputs(taskResult))
            .then(appOutputs => this._outputsStore().save(taskDef.id, appOutputs))
            .then(appOutputs => _.assign({}, appChainOutputs, appOutputs));
    }

    _executeTask(taskDef, appChainOutputs) {
        return this._createTask(taskDef, appChainOutputs).execute();
    }

    _createTask(taskDef, appChainOutputs) {
        return this._taskFactory.createTask({
            taskDef: taskDef,
            appChainOutputs: appChainOutputs,
            appOutputs: _.get(appChainOutputs, this._appNamespace(), {})
        });
    }

    _extractAppOutputs(taskResult) {
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