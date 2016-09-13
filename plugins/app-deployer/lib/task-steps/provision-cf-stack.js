'use strict';

class ProvisionCfStack {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
        this._fileReader = params.fileReader;
        this._logger = params.context.logger;
        this._stackNameExpander = params.stackNameExpander;
    }

    execute(state) {
        const stackName = this._stackNameExpander.expand(state.taskDef.stackName);
        const templateFile = state.envVars.templateOutputFile;
        const cfHelper = this._awsHelpers.cf({region: state.taskDef.region});
        this._logger.info(`Provisioning stack ${stackName}`);

        return this._fileReader.readJson(templateFile)
            .then(template => JSON.stringify(template))
            .then(template => cfHelper.provisionStack({StackName: stackName, TemplateBody: template}))
            .then(() => cfHelper.extractOutputs(stackName))
            .then(outputs => Object.assign({}, state, {outputs: outputs}));
    }
}

module.exports = ProvisionCfStack;
