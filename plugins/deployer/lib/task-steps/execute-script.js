'use strict';

const Promise = require('bluebird');

class ExecuteScript {

    constructor(params) {
        this._context = params.context;
        this._deploymentScriptExecutor = params.deploymentScriptExecutor;
        this._envVarsFormatter = params.envVarsFormatter;
        this._scriptName = params.scriptName;
    }

    execute(state) {
        const scriptDef = state.taskDef[this._scriptName];
        if (!scriptDef) return Promise.resolve(state);

        const envVars = this._getEnvVars(scriptDef, state);
        const updatedScriptDef = Object.assign({}, scriptDef, {envVars});
        const options = {cwd: this._context.moduleDir};
        return this._deploymentScriptExecutor.execute(updatedScriptDef, options).then(() => state);
    }

    _getEnvVars(scriptDef, state) {
        return Object.assign(this._defaultEnvVars(state), scriptDef.envVars);
    }

    _defaultEnvVars(state) {
        return this._envVarsFormatter.format(state.taskVars);
    }
}

module.exports = ExecuteScript;
