'use strict';

const _ = require('lodash');

class ExecuteTasks {

    constructor(params) {
        this._logger = params.logger;
        this._taskFactory = params.taskFactory;
    }

    execute(state) {
        return this._executeTasks(state).then(deploymentOutputs =>
            Object.assign({}, state, {deploymentOutputs})
        );
    }

    _executeTasks(state) {
        const deploymentConfig = state.deploymentConfig;
        const dataSourceData = state.dataSourceData;
        const outputsStore = state.outputsStore;

        return state.taskDefs.reduce((promise, taskDef) => {
            return promise.then(deploymentOutputs => {
                const params = {deploymentConfig, deploymentOutputs, dataSourceData};
                return this._executeTask(taskDef, params, outputsStore).then(
                    taskOutputs => _.merge({}, deploymentOutputs, taskOutputs)
                );
            });
        }, Promise.resolve(state.deploymentOutputs));
    }

    _executeTask(taskDef, params, outputsStore) {
        const taskId = taskDef.id;
        const taskParams = Object.assign({}, {taskDef}, params);
        const task = this._taskFactory.createTask(taskParams);

        this._logger.info(`\n--->Executing task: ${taskId}`);

        return task.execute()
            .then(result => _.get(result, 'outputs', {}))
            .then(outputs => outputsStore.save(taskId, outputs).then(() => outputs));
    }
}

module.exports = ExecuteTasks;
