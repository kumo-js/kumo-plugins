'use strict';

const aws = require('aws-sdk');
const cf = new aws.CloudFormation();
const fs = require('fs');
const CfHelper = require('../../common-lib/cf-helper');
const CreateEnvVarsStep = require('./task-steps/create-env-vars');
const CreateCfEnvVarsStep = require('./task-steps/create-cf-env-vars');
const ExecuteScriptStep = require('./task-steps/execute-script');
const InitTaskStep = require('./task-steps/init-task');
const ProvisionCfStackStep = require('./task-steps/provision-cf-stack');
const Shell = require('../../common-lib/shell');
const StepsExecutor = require('../../common-lib/steps-executor');

class TaskFactory {

    constructor(params) {
        this._context = params.context;
    }

    createTask(params) {
        return new StepsExecutor({
            initialState: params,
            steps: this._createTaskSteps(params.taskDef.type)
        });
    }

    _createTaskSteps(taskType) {
        return {
            'cf-stack': this._cfTaskSteps,
            undefined: this._customTaskSteps

        }[taskType].bind(this)();
    }

    _cfTaskSteps() {
        return [
            this._initStep(),
            this._createEnvVarsStep(),
            this._createCfEnvVarsStep(),
            this._executeScriptStep(),
            this._provisionCfStackStep()
        ]
    }

    _customTaskSteps() {
        return [
            this._initStep(),
            this._createEnvVarsStep(),
            this._executeScriptStep()
            //this._collectOutputsStep()
        ]
    }

    _initStep() {
        const context = this._context;
        return new InitTaskStep({context, fs});
    }

    _createEnvVarsStep() {
        const context = this._context;
        return new CreateEnvVarsStep({context});
    }

    _createCfEnvVarsStep() {
        const context = this._context;
        return new CreateCfEnvVarsStep({context});
    }

    _executeScriptStep(options) {
        const context = this._context;
        const shell = new Shell({logger: context.logger()});
        return new ExecuteScriptStep({context, options, shell});
    }

    _provisionCfStackStep() {
        const context = this._context;
        const cfHelper = new CfHelper({cf});
        return new ProvisionCfStackStep({context, cfHelper, fs});
    }
}

module.exports = TaskFactory;
