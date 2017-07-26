'use strict';

const TaskFactory = require('./task-factory');
const TaskService = require('./task-service');

class TaskServiceFactory {

    constructor(params) {
        this._context = params.context;
    }

    createService(params) {
        const logger = this._context.logger;
        const outputsStore = params.outputsStore;
        const taskFactory = new TaskFactory({context: this._context});
        return new TaskService({logger, outputsStore, taskFactory});
    }
}

module.exports = TaskServiceFactory;
