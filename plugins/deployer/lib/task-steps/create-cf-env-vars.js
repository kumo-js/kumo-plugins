'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CreateCfEnvVars {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve(_.merge({}, state, {
            envVars: {
                templateOutputFile: this._context.generateTempFile()
            }
        }));
    }
}

module.exports = CreateCfEnvVars;
