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
                    appConfig: JSON.stringify(state.appChainConfig),
                    appOutputs: JSON.stringify(state.appChainOutputs),
                    env: this._context.env.value(),
                    region: state.taskDef.region,
                    taskOutputsFile: this._context.generateTempFile()
                }
            })
        );
    }
}

module.exports = CreateEnvVars;
