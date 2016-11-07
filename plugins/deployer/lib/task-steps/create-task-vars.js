'use strict';

const Promise = require('bluebird');

class CreateTaskVars {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve(
            Object.assign({}, state, {taskVars: this._createTaskVars(state)})
        );
    }

    _createTaskVars(state) {
        return Object.assign(
            {
                deploymentConfig: state.deploymentConfig,
                deploymentOutputs: state.deploymentOutputs,
                region: state.taskDef.region,
                taskOutputsFile: this._context.generateTempFile()
            },
            this._context.env.toVars()
        );
    }
}

module.exports = CreateTaskVars;
