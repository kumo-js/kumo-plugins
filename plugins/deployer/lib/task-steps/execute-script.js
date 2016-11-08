'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class ExecuteScript {

    constructor(params) {
        this._context = params.context;
        this._envVarsFormatter = params.envVarsFormatter;
        this._scriptKey = params.scriptKey;
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(state) {
        const scriptDef = state.taskDef[this._scriptKey];
        if (!scriptDef) return Promise.resolve(state);

        return this._scriptExecutor.execute(
            scriptDef.script,
            {
                cwd: this._context.moduleDir,
                envVars: this._getEnvVars(scriptDef, state)
            }
        ).then(() => state);
    }

    _getEnvVars(scriptDef, state) {
        return Object.assign(this._defaultEnvVars(state), scriptDef.envVars);
    }

    _defaultEnvVars(state) {
        var t = this._envVarsFormatter.format(
            _.reduce(state.taskVars, (result, v, k) => {
                v = _.isPlainObject(v) ? JSON.stringify(v) : v;
                return Object.assign(result, {[k]: v});
            }, {})
        );

        return t;
    }
}

module.exports = ExecuteScript;
