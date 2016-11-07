'use strict';

const _ = require('lodash');

class ScriptExecutor {

    constructor(params) {
        this._logger = params.logger;
        this._runScript = params.runScript;
    }

    execute(script, options) {
        options = Object.assign({logOutput: true}, options);
        return this._executeScript(script, options);
    }

    _executeScript(script, options) {
        options = _.merge({env: process.env}, {env: options.envVars}, options);
        this._logger.debug(`Running: ${script}`);

        return this._runScript(script, options).then(output => {
            output = output.join('').trim();
            const logOutput = (output !== '' && options.logOutput);
            if (logOutput) this._logger.debug(output);
            return output;
        });
    }
}

module.exports = ScriptExecutor;
