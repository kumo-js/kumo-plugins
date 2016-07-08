'use strict';

class TaskExecutor {

    constructor(params) {
        this._taskFactory = params.taskFactory;
        this._appResourcesRepository = params.appResourcesRepository;
    }

    execute(taskDef, appChainResources) {

        this._appResourcesRepository.save()
    }
}

module.exports = TaskExecutor;