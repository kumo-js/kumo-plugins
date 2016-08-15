'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CreateEnvVars {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve(_.merge({}, state, {
            envVars: {
                appInputsFile: state.appOutputsFile,
                appChainInputsFile: state.appChainOutputsFile,
                env: this._context.env().value(),
                region: state.taskDef.region,
                taskOutputsFile: this._context.tempFile()
            }
        }));
    }
}

module.exports = CreateEnvVars;
