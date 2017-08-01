'use strict';

const _ = require('lodash');

class ExecuteTasks {

    constructor(params) {
        this._context = params.context;
        this._logger = params.context.logger;
        this._taskFactory = params.taskFactory;
    }

    execute(state) {
        return this._extractTaskSections().reduce(
            (promise, taskSection) => {
                return promise.then(state =>
                    this._executeTask(taskSection, state).then(state => {
                        const deploymentOutputs = state.deploymentOutputs;
                        this._context.settings.addRefData({deploymentOutputs});
                        return state;
                    })
                );
            }, Promise.resolve(state)
        );
    }

    _executeTask(taskSection, state) {
        const taskId = taskSection.getValue().id;
        const task = this._taskFactory.createTask(taskSection);
        const outputsStore = state.outputsStore;
        const executedTaskIds = state.executedTaskIds || [];
        this._logger.info(`\n---> Executing task: ${taskId}`);

        return task.execute()
            .then(result => _.get(result, 'outputs', {}))
            .then(outputs => outputsStore.save(taskId, outputs).then(() => outputs))
            .then(outputs => _.merge({}, state, {deploymentOutputs: outputs}))
            .then(state => Object.assign({}, state, {executedTaskIds: executedTaskIds.concat(taskId)}));
    }

    _extractTaskSections() {
        return this._context.settings.extractCollection('tasks');
    }
}

module.exports = ExecuteTasks;
