'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class TaskUndoer {

    constructor(params) {
        this._context = params.context;
        this._outputsStoreFactory = params.outputsStoreFactory;
        this._taskFactory = params.taskFactory;
    }

    undo(taskDef, appChainOutputs) {
        return Promise.resolve()
            .then(() => this._undoTask(taskDef, appChainOutputs))
            .then(() => this._outputsStore().remove(taskDef.id))
    }

    _undoTask(taskDef, appChainOutputs) {
        return this._createUndoTask(taskDef, appChainOutputs).execute();
    }

    _createUndoTask(taskDef, appChainOutputs) {
        return this._taskFactory.createUndoTask({
            taskDef: taskDef,
            appChainOutputs: appChainOutputs,
            appOutputs: _.get(appChainOutputs, this._appNamespace(), {})
        });
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

module.exports = TaskUndoer;