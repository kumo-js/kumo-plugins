'use strict';

const Promise = require('bluebird');

class CreateEnvVars {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve(
            Object.assign({}, state, {envVars: this._createEnvVars(state)})
        );
    }

    _createEnvVars(state) {
        return Object.assign(
            {
                deploymentConfig: JSON.stringify(state.deploymentConfig),
                deploymentOutputs: JSON.stringify(state.deploymentOutputs),
                region: state.taskDef.region,
                taskOutputsFile: this._context.generateTempFile()
            },
            this._context.env.toVars()
        );
    }
}

module.exports = CreateEnvVars;
