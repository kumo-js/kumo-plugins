'use strict';

const Promise = require('bluebird');

class CreateEnvVars {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve(
            Object.assign({}, state, {
                envVars: {
                    deploymentConfig: JSON.stringify(state.deploymentConfig),
                    deploymentOutputs: JSON.stringify(state.deploymentOutputs),
                    env: this._context.env.value(),
                    region: state.taskDef.region,
                    taskOutputsFile: this._context.generateTempFile()
                }
            })
        );
    }
}

module.exports = CreateEnvVars;
