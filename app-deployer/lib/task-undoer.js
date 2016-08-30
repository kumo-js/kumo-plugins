'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class TaskUndoer {

    constructor(params) {
        this._context = params.context;
        this._logger = this._context.logger();
        this._outputsStoreFactory = params.outputsStoreFactory;
        this._taskFactory = params.taskFactory;
    }

    undo(params) {
        const taskId = params.taskDef.id;
        this._logger.info(`\n--->Undoing task: ${taskId}`);

        return Promise.resolve()
            .then(() => this._createUndoTask(params).execute())
            .then(() => this._outputsStore().remove(taskId));
    }

    _createUndoTask(params) {
        const appChainOutputs = params.appChainOutputs;
        const appOutputs = _.get(appChainOutputs, this._appNamespace(), {});
        return this._taskFactory.createUndoTask(_.assign({}, params, {appOutputs}));
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