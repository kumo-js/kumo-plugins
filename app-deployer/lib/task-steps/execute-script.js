'use strict';

const _ = require('lodash');
const inflect = require('i')();
const Promise = require('bluebird');

class ExecuteScript {

    constructor(params) {
        this._context = params.context;
        this._options = _.assign(this._defaultOptions(), params.options);
        this._shell = params.shell;
    }

    execute(state) {
        const script = state.taskDef.scripts[this._options.scriptType];
        const result = script ? this._execute(script, state.envVars) : Promise.resolve();
        return result.then(() => state);
    }

    _execute(script, envVars) {
        envVars = this._formatEnvVars(envVars);
        envVars = Object.assign({}, process.env, envVars);
        const params = {env: envVars, cwd: this._context.appDir()};
        return this._shell.run(script, params);
    }

    _formatEnvVars(envVars) {
        return _.reduce(envVars, (result, v, k) => {
            const newKey = `KUMO_${inflect.underscore(k).toUpperCase()}`;
            return _.assign(result, {[newKey]: v});
        }, {});
    }

    _defaultOptions() {
        return {scriptType: 'run'};
    }
}

module.exports = ExecuteScript;
