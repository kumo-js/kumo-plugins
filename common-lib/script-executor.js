'use strict';

class ScriptExecutor {

    constructor(params) {
        this._logger = params.logger;
        this._options = params.options || {};
        this._runScript = params.runScript;
    }

    execute(script, options) {
        const env = this._formatEnvVars(options.env);
        options = Object.assign({logOutput: true}, options, {env});
        return this._executeScript(script, options);
    }

    _executeScript(script, options) {
        this._logger.debug(`Running: ${script}`);
        return this._runScript(script, options).then(output => {
            output = output.join('').trim();
            const logOutput = (output !== '' && options.logOutput);
            if (logOutput) this._logger.debug(output);
            return output;
        });
    }

    _formatEnvVars(envVars) {
        const formatter = this._options.envVarsFormatter;
        return formatter ? formatter.format(envVars) : envVars;
    }
}

module.exports = ScriptExecutor;
