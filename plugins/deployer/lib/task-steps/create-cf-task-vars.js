'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CreateCfTaskVars {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve(_.merge({}, state, {
            taskVars: {
                templateOutputFile: this._context.generateTempFile()
            }
        }));
    }
}

module.exports = CreateCfTaskVars;
