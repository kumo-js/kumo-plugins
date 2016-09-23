'use strict';

const _ = require('lodash');

class ProvisionCfStack {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
        this._fileReader = params.fileReader;
        this._logger = params.context.logger;
        this._stackNameExpander = params.stackNameExpander;
    }

    execute(state) {
        const templateFile = state.envVars.templateOutputFile;
        return this._fileReader.readJson(templateFile)
            .then(template => JSON.stringify(template))
            .then(template => this._provisionCfStack(template, state.taskDef))
            .then(outputs => Object.assign({}, state, {outputs: outputs}));
    }

    _provisionCfStack(template, taskDef) {
        const stackName = this._stackNameExpander.expand(taskDef.stackName);
        const stackParams = this._buildCfStackParams(taskDef);
        const cfHelper = this._awsHelpers.cf({region: taskDef.region});
        const params = {StackName: stackName, Parameters: stackParams, TemplateBody: template};
        this._logger.info(`Provisioning stack ${stackName}`);
        return cfHelper.provisionStack(params).then(() => cfHelper.extractOutputs(stackName));
    }

    _buildCfStackParams(taskDef) {
        return _.map(taskDef.stackParams, (value, key) =>
            ({ParameterKey: key, ParameterValue: value})
        );
    }
}

module.exports = ProvisionCfStack;
