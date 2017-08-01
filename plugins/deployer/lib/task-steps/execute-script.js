'use strict';

class ExecuteScript {

    constructor(params) {
        this._context = params.context;
        this._deploymentScriptExecutor = params.deploymentScriptExecutor;
        this._scriptName = params.scriptName;
    }

    execute(state) {
        const scriptDef = state.taskDef[this._scriptName];
        if (!scriptDef) return Promise.resolve(state);

        const envVars = Object.assign({}, scriptDef.envVars);
        const updatedScriptDef = Object.assign({}, scriptDef, {envVars});
        const options = {cwd: this._context.moduleDir};
        return this._deploymentScriptExecutor.execute(updatedScriptDef, options).then(() => state);
    }
}

module.exports = ExecuteScript;
