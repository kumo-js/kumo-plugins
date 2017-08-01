'use strict';

const _ = require('lodash');

class DeploymentScriptExecutor {

    constructor(params) {
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(scriptDef, options) {
        let envVars = Object.assign({}, scriptDef.envVars);
        envVars = this._flattenEnvVars(envVars);
        options = Object.assign({}, options, {envVars});
        return this._scriptExecutor.execute(scriptDef.script, options);
    }

    _flattenEnvVars(envVars) {
        return _.mapValues(envVars,
            v => _.isPlainObject(v) ? JSON.stringify(v) : v
        );
    }
}

module.exports = DeploymentScriptExecutor;
