'use strict';

class UndoTasks {

    constructor(params) {
        this._context = params.context;
        this._logger = params.context.logger;
        this._taskFactory = params.taskFactory;
    }

    execute(state) {
        return this._extractTaskSections().reduceRight(
            (promise, taskSection) => {
                return promise.then(state => this._undoTask(taskSection, state));
            }, Promise.resolve(state)
        );
    }

    _undoTask(taskSection, state) {
        const taskId = taskSection.getValue().id;
        const task = this._taskFactory.createUndoTask(taskSection);
        const outputsStore = state.outputsStore;
        this._logger.info(`\n---> Undoing task: ${taskId}`);

        return task.execute()
            .then(() => outputsStore.remove(taskId))
            .then(() => state);
    }

    _extractTaskSections() {
        return this._context.settings.extractCollection('tasks');
    }
}

module.exports = UndoTasks;
