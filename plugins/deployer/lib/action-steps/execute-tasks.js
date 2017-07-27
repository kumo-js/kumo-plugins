'use strict';

const _ = require('lodash');

class ExecuteTasks {

    constructor(params) {
        this._context = params.context;
        this._logger = params.context.logger;
        this._taskDefExpander = params.taskDefExpander;
        this._taskFactory = params.taskFactory;
    }

    execute(state) {
        return this._context.settings.reduce('tasks',
            (state, taskDef) => {
                return this._executeTask(taskDef, state).then(state => {
                    const deploymentOutputs = state.deploymentOutputs;
                    this._context.settings.addRefData({deploymentOutputs});
                    return state;
                });
            }, state
        );
    }

    _executeTask(taskDef, state) {
        const taskId = taskDef.id;
        const task = this._createTask(taskDef, state);
        const outputsStore = state.outputsStore;
        const executedTaskIds = state.executedTaskIds || [];
        this._logger.info(`\n---> Executing task: ${taskId}`);

        return task.execute()
            .then(result => _.get(result, 'outputs', {}))
            .then(outputs => outputsStore.save(taskId, outputs).then(() => outputs))
            .then(outputs => _.merge({}, state, {deploymentOutputs: outputs}))
            .then(state => Object.assign({}, state, {executedTaskIds: executedTaskIds.concat(taskId)}));
    }

    _createTask(taskDef, state) {
        const expandedTaskDef = this._taskDefExpander.expand(taskDef);
        return this._taskFactory.createTask({
            taskDef: expandedTaskDef,
            deploymentConfig: state.deploymentConfig,
            dataSourceData: state.dataSourceData,
            deploymentOutputs: state.deploymentOutputs
        });
    }
}

module.exports = ExecuteTasks;
