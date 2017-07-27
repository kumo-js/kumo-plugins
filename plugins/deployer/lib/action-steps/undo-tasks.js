'use strict';

class UndoTasks {

    constructor(params) {
        this._logger = params.logger;
        this._taskFactory = params.taskFactory;
    }

    execute(state) {
        return this._undoTasks(state).then(() => state);
    }

    _undoTasks(state) {
        const deploymentConfig = state.deploymentConfig;
        const deploymentOutputs = state.deploymentOutputs;
        const dataSourceData = state.dataSourceData;
        const outputsStore = state.outputsStore;

        return state.taskDefs.reverse().reduce((promise, taskDef) => {
            const params = {deploymentConfig, deploymentOutputs, dataSourceData};
            return promise.then(() => this._undoTask(taskDef, params, outputsStore));
        }, Promise.resolve());
    }

    _undoTask(taskDef, params, outputsStore) {
        const taskId = taskDef.id;
        const taskParams = Object.assign({}, {taskDef}, params);
        const task = this._taskFactory.createUndoTask(taskParams);

        this._logger.info(`\n--->Undoing task: ${taskId}`);
        return task.execute().then(() => outputsStore.remove(taskId));
    }
}

module.exports = UndoTasks;
