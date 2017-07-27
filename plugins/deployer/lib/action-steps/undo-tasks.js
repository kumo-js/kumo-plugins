'use strict';

class UndoTasks {

    constructor(params) {
        this._context = params.context;
        this._logger = params.context.logger;
        this._taskDefExpander = params.taskDefExpander;
        this._taskFactory = params.taskFactory;
    }

    execute(state) {
        return this._context.settings.reduceRight('tasks',
            (state, taskDef) => this._undoTask(taskDef, state), state
        );
    }

    _undoTask(taskDef, state) {
        const taskId = taskDef.id;
        const task = this._createUndoTask(taskDef, state);
        const outputsStore = state.outputsStore;
        this._logger.info(`\n---> Undoing task: ${taskId}`);

        return task.execute()
            .then(() => outputsStore.remove(taskId))
            .then(() => state);
    }

    _createUndoTask(taskDef, state) {
        const expandedTaskDef = this._taskDefExpander.expand(taskDef);
        return this._taskFactory.createUndoTask({
            taskDef: expandedTaskDef,
            deploymentConfig: state.deploymentConfig,
            dataSourceData: state.dataSourceData,
            deploymentOutputs: state.deploymentOutputs
        });
    }
}

module.exports = UndoTasks;
