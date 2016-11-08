
'use strict';

class ContextInitializer {

    initialize(context, actionParams) {
        return Promise.resolve({
            cwd: actionParams.kumoContext.cwd,
            kumoSettings: actionParams.kumoContext.settings,
            logger: actionParams.logger,
            args: actionParams.args
        });
    }

}

module.exports = ContextInitializer;
