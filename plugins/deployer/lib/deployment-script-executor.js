'use strict';

const _ = require('lodash');

class DeploymentScriptExecutor {

    constructor(params) {
        this._context = params.context;
        this._envVarsFormatter = params.envVarsFormatter;
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(scriptDef, options) {
        let envVars = Object.assign(this._defaultEnvVars(), scriptDef.envVars);
        envVars = this._flattenEnvVars(envVars);
        options = Object.assign({}, options, {envVars});
        return this._scriptExecutor.execute(scriptDef.script, options);
    }

    _defaultEnvVars() {
        const argsEnvVars = _.mapKeys(this._context.args, (v, k) => `arg-${k}`);
        return this._envVarsFormatter.format(
            Object.assign(this._context.env.toVars(), argsEnvVars)
        );
    }

    _flattenEnvVars(envVars) {
        return _.mapValues(envVars,
            v => _.isPlainObject(v) ? JSON.stringify(v) : v
        );
    }
}

module.exports = DeploymentScriptExecutor;
