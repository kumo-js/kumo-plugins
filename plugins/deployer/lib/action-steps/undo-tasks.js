'use strict';

class UndoTasks {

    constructor(params) {
        this._taskServiceFactory = params.taskServiceFactory;
    }

    execute(state) {
        return this._undoTasks(state).then(() => state);
    }

    _undoTasks(state) {
        const deploymentConfig = state.deploymentConfig;
        const deploymentOutputs = state.deploymentOutputs;
        const taskService = this._createTaskService(state);

        return state.taskDefs.reverse().reduce((promise, taskDef) => {
            const params = {taskDef, deploymentConfig, deploymentOutputs};
            return promise.then(() => taskService.undoTask(params));
        }, Promise.resolve());
    }

    _createTaskService(state) {
        return this._taskServiceFactory.createService({
            outputsStore: state.outputsStore
        });
    }
}

module.exports = UndoTasks;
