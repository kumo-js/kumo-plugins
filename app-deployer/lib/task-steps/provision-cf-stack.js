'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class ProvisionCfStack {

    constructor(params) {
        this._awsHelpers = params.awsHelpers;
        this._fs = Promise.promisifyAll(params.fs);
        this._stackNameExpander = params.stackNameExpander;
    }

    execute(state) {
        const stackName = this._stackNameExpander.expand(state.taskDef.stackName);
        const templateFile = state.envVars.templateOutputFile;
        const cfHelper = this._awsHelpers.cf({region: state.taskDef.region});

        return this._fs.readFileAsync(templateFile)
            .then(template => template.toString())
            .then(template => cfHelper.provisionStack({StackName: stackName, TemplateBody: template}))
            .then(() => cfHelper.extractOutputs(stackName))
            .then(outputs => _.assign({}, state, {outputs: outputs}));
    }
}

module.exports = ProvisionCfStack;
