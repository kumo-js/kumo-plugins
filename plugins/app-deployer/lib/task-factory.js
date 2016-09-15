'use strict';

const fs = require('fs'),
    runScript = require('command-promise'),
    AwsHelpers = require('../../../common-lib/aws-helpers'),
    DeleteCfStackStep = require('./task-steps/delete-cf-stack'),
    CollectTaskOutputsStep = require('./task-steps/collect-task-outputs'),
    CreateEnvVarsStep = require('./task-steps/create-env-vars'),
    CreateCfEnvVarsStep = require('./task-steps/create-cf-env-vars'),
    ExecuteScriptStep = require('./task-steps/execute-script'),
    EnvVarsFormatter = require('../../../common-lib/env-vars-formatter'),
    JsonCompatibleFileReader = require('../../../common-lib/json-compatible-file-reader'),
    ProvisionCfStackStep = require('./task-steps/provision-cf-stack'),
    ScriptExecutor = require('../../../common-lib/script-executor'),
    StepsExecutor = require('../../../common-lib/steps-executor'),
    StackNameExpander = require('./stack-name-expander');

class TaskFactory {

    constructor(params) {
        this._context = params.context;
    }

    createTask(params) {
        return this._createTask(params, () => ({
            'cf-stack': this._cfTaskSteps,
            'custom': this._customTaskSteps
        }));
    }

    createUndoTask(params) {
        return this._createTask(params, () => ({
            'cf-stack': this._undoCfTaskSteps,
            'custom': this._undoCustomTaskSteps
        }));
    }

    _createTask(params, getStepCreators) {
        const stepCreators = getStepCreators();
        const stepCreator = stepCreators[params.taskDef.type];
        const steps = stepCreator.call(this);
        return new StepsExecutor({initialState: params, steps: steps});
    }

    _cfTaskSteps() {
        return [
            this._createEnvVarsStep(),
            this._createCfEnvVarsStep(),
            this._executeScriptStep(),
            this._provisionCfStackStep()
        ]
    }

    _customTaskSteps() {
        return [
            this._createEnvVarsStep(),
            this._executeScriptStep(),
            this._collectTaskOutputsStep()
        ]
    }

    _undoCfTaskSteps() {
        return [this._deleteCfStackStep()];
    }

    _undoCustomTaskSteps() {
        return [
            this._createEnvVarsStep(),
            this._executeScriptStep({scriptType: 'undo'})
        ]
    }

    _createEnvVarsStep() {
        const context = this._context;
        return new CreateEnvVarsStep({context, fs});
    }

    _createCfEnvVarsStep() {
        const context = this._context;
        return new CreateCfEnvVarsStep({context});
    }

    _collectTaskOutputsStep() {
        const fileReader = this._fileReader();
        return new CollectTaskOutputsStep({fileReader});
    }

    _deleteCfStackStep() {
        const awsHelpers = this._awsHelpers();
        const context = this._context;
        const stackNameExpander = this._stackNameExpander();
        return new DeleteCfStackStep({awsHelpers, context, stackNameExpander});
    }

    _executeScriptStep(options) {
        const context = this._context;
        const scriptExecutor = this._scriptExecutor(context);
        return new ExecuteScriptStep({context, options, scriptExecutor});
    }

    _provisionCfStackStep() {
        const awsHelpers = this._awsHelpers();
        const context = this._context;
        const fileReader = this._fileReader();
        const stackNameExpander = this._stackNameExpander();
        return new ProvisionCfStackStep({awsHelpers, context, fileReader, stackNameExpander});
    }

    _fileReader() {
        return new JsonCompatibleFileReader();
    }

    _stackNameExpander() {
        return new StackNameExpander({context: this._context});
    }

    _scriptExecutor(context) {
        const logger = context.logger;
        const options = {envVarsFormatter: new EnvVarsFormatter({})};
        return new ScriptExecutor({logger, runScript, options});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }
}

module.exports = TaskFactory;