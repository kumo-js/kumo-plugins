'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class ExecuteTasks {

    constructor(params) {
        this._context = params.context;
        this._taskService = params.taskService;
    }

    execute(state) {
        return this._executeTasks(state).then(deploymentOutputs =>
            Object.assign({}, state, {deploymentOutputs})
        );
    }

    _executeTasks(state) {
        const deploymentConfig = state.deploymentConfig;
        const dataSourceData = state.dataSourceData;

        return state.taskDefs.reduce((promise, taskDef) => {
            return promise.then(deploymentOutputs => this._executeTask(
                {taskDef, deploymentConfig, deploymentOutputs, dataSourceData}
            ));
        }, Promise.resolve(state.deploymentOutputs));
    }

    _executeTask(params) {
        const moduleName = this._context.settings.moduleName;
        return this._taskService.executeTask(params).then(taskOutputs =>
            _.merge({}, params.deploymentOutputs, {[moduleName]: taskOutputs})
        );
    }
}

module.exports = ExecuteTasks;
