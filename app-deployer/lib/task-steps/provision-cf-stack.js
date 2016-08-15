'use strict';

const Promise = require('bluebird');

class ProvisionCfStack {

    constructor(params) {
        this._cfHelper = params.cfHelper;
        this._context = params.context;
        this._fs = Promise.promisifyAll(params.fs);
    }

    execute(state) {
        const stackName = this._stackName(state.taskDef);
        const templateFile = state.envVars.templateOutputFile;

        return this._fs.readFileAsync(templateFile)
            .then(template => this._cfHelper.provisionStack(stackName, template))
            .then(() => this._cfHelper.extractOutputs(stackName))
            .then(outputs => _.assign({}, state, {outputs: outputs}));
    }

    _stackName(taskDef) {
        const appName = this._context.settings().appName();
        const env = this._context.env().value();
        const name = `${env}-${appName}-${taskDef.stackName}`;
        return name.replace(/\s/, '-').toLowerCase();
    }
}

module.exports = ProvisionCfStack;
