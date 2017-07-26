'use strict';

const _ = require('lodash');

class ExecuteTasks {

    constructor(params) {
        this._taskServiceFactory = params.taskServiceFactory;
    }

    execute(state) {
        return this._executeTasks(state).then(deploymentOutputs =>
            Object.assign({}, state, {deploymentOutputs})
        );
    }

    _executeTasks(state) {
        const deploymentConfig = state.deploymentConfig;
        const dataSourceData = state.dataSourceData;
        const taskService = this._createTaskService(state);

        return state.taskDefs.reduce((promise, taskDef) => {
            return promise.then(deploymentOutputs => {
                const params = {taskDef, deploymentConfig, deploymentOutputs, dataSourceData};
                return taskService.executeTask(params).then(
                    taskOutputs => _.merge({}, deploymentOutputs, taskOutputs)
                );
            });
        }, Promise.resolve(state.deploymentOutputs));
    }

    _createTaskService(state) {
        return this._taskServiceFactory.createService({
            outputsStore: state.outputsStore
        });
    }
}

module.exports = ExecuteTasks;
