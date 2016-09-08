'use strict';

const Promise = require('bluebird');

class ExecuteScript {

    constructor(params) {
        this._context = params.context;
        this._options = Object.assign(this._defaultOptions(), params.options);
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(state) {
        const script = state.taskDef.scripts[this._options.scriptType];
        const options = {env: state.envVars, cwd: this._context.appDir};
        const result = script ? this._scriptExecutor.execute(script, options) : Promise.resolve();
        return result.then(() => state);
    }

    _defaultOptions() {
        return {scriptType: 'run'};
    }
}

module.exports = ExecuteScript;
