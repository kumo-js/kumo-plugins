'use strict';

const runCmd = require('command-promise');

class Shell {

    constructor(params) {
        this._logger = params.logger;
    }

    run(cmd, options) {
        this._logger.debug(`Running cmd: ${cmd}`);
        return runCmd(cmd, options).then(
            output => this._logger.debug(output.join(''))
        );
    }
}

module.exports = Shell;
