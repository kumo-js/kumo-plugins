'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class ProvisionCfStack {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
        this._fileReader = params.fileReader;
        this._fs = Promise.promisifyAll(params.fs);
        this._logger = params.context.logger;
    }

    execute(state) {
        const taskRegion = state.taskVars.taskRegion;
        const taskOutputsFile = state.taskVars.taskOutputsFile;
        const templateFile = state.taskVars.templateOutputFile;

        return this._fileReader.readAsObject(templateFile)
            .then(template => JSON.stringify(template))
            .then(template => this._provisionCfStack(template, state.taskDef, taskRegion))
            .then(outputs => this._fs.writeFileAsync(taskOutputsFile, JSON.stringify(outputs)))
            .then(() => state);
    }

    _provisionCfStack(template, taskDef, region) {
        const stackName = taskDef.stackName;
        const stackParams = this._buildCfStackParams(taskDef);
        const cfHelper = this._awsHelpers.cf({region});
        this._logger.info(`Provisioning stack ${stackName}`);

        return cfHelper.provisionStack({
            StackName: stackName,
            Parameters: stackParams,
            TemplateBody: template,
            Capabilities: ['CAPABILITY_IAM']
        }).then(() => cfHelper.extractOutputs(stackName));
    }

    _buildCfStackParams(taskDef) {
        return _.map(taskDef.stackParams, (value, key) =>
            ({ParameterKey: key, ParameterValue: value})
        );
    }
}

module.exports = ProvisionCfStack;
