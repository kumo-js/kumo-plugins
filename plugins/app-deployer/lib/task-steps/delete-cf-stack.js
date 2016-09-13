'use strict';

class DeleteCfStack {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
        this._logger = params.context.logger;
        this._stackNameExpander = params.stackNameExpander;
    }

    execute(state) {
        const stackName = this._stackNameExpander.expand(state.taskDef.stackName);
        const cfHelper = this._awsHelpers.cf({region: state.taskDef.region});
        this._logger.info(`Deleting stack ${stackName}`);

        return cfHelper.searchStack(stackName)
            .then(stack => stack ? cfHelper.deleteStack(stackName) : null)
            .then(() => state);
    }
}

module.exports = DeleteCfStack;
