'use strict';

const Promise = require('bluebird');

class ExecuteScript {

    constructor(params) {
        this._context = params.context;
        this._scriptKey = params.scriptKey;
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(state) {
        const script = state.taskDef[this._scriptKey];
        const options = {env: state.envVars, cwd: this._context.appDir};
        const result = script ? this._scriptExecutor.execute(script, options) : Promise.resolve();
        return result.then(() => state);
    }
}

module.exports = ExecuteScript;
