'use strict';

const _ = require('lodash');
const inflect = require('i')();

class ExecuteScript {

    constructor(params) {
        this._context = params.context;
        this._options = _.assign(this._defaultOptions(), params.options);
        this._shell = params.shell;
    }

    execute(state) {
        const envVars = this._formatEnvVars(state.envVars);
        const script = state.taskDef.scripts[this._options.scriptType];
        const scriptParams = {env: envVars, cwd: this._context.appDir()};
        return this._shell.run(script, scriptParams).then(() => state);
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
