'use strict';

const fs = require('fs');
const runScript = require('command-promise');
const AwsHelpers = require('../../../common-lib/lib/aws-helpers');
const DeleteCfStackStep = require('./task-steps/delete-cf-stack');
const DerefTaskAttributesStep = require('./task-steps/deref-task-attributes');
const DeploymentScriptExecutor = require('./deployment-script-executor');
const CollectTaskOutputsStep = require('./task-steps/collect-task-outputs');
const CreateTaskVarsStep = require('./task-steps/create-task-vars');
const CreateCfTaskVarsStep = require('./task-steps/create-cf-task-vars');
const ExecuteScriptStep = require('./task-steps/execute-script');
const EnvVarsFormatter = require('../../../common-lib/lib/env-vars-formatter');
const JsonCompatibleFileReader = require('../../../common-lib/lib/json-compatible-file-reader');
const ObjectResolver = require('../../../common-lib/lib/object-resolver');
const ProvisionCfStackStep = require('./task-steps/provision-cf-stack');
const ScriptExecutor = require('../../../common-lib/lib/script-executor');
const StepsExecutor = require('../../../common-lib/lib/steps-executor');
const StackNameExpander = require('./stack-name-expander');

class TaskFactory {

    constructor(params) {
        this._context = params.context;
    }

    createTask(params) {
        return this._createTask(params, () => ({
            'cf-stack': this._cfTaskSteps,
            custom: this._customTaskSteps
        }));
    }

    createUndoTask(params) {
        return this._createTask(params, () => ({
            'cf-stack': this._undoCfTaskSteps,
            custom: this._undoCustomTaskSteps
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
            this._createTaskVarsStep(),
            this._createCfTaskVarsStep(),
            this._derefTaskAttributesStep(),
            this._executeScriptStep('stackTemplate'),
            this._provisionCfStackStep(),
            this._collectTaskOutputsStep()
        ];
    }

    _customTaskSteps() {
        return [
            this._createTaskVarsStep(),
            this._derefTaskAttributesStep(),
            this._executeScriptStep('run'),
            this._collectTaskOutputsStep()
        ];
    }

    _undoCfTaskSteps() {
        return [
            this._createTaskVarsStep(),
            this._derefTaskAttributesStep(),
            this._deleteCfStackStep()
        ];
    }

    _undoCustomTaskSteps() {
        return [
            this._createTaskVarsStep(),
            this._derefTaskAttributesStep(),
            this._executeScriptStep('undo')
        ];
    }

    _createTaskVarsStep() {
        const context = this._context;
        return new CreateTaskVarsStep({context});
    }

    _createCfTaskVarsStep() {
        const context = this._context;
        return new CreateCfTaskVarsStep({context});
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

    _executeScriptStep(scriptName) {
        const context = this._context;
        const envVarsFormatter = new EnvVarsFormatter({});
        const scriptExecutor = this._scriptExecutor(context.logger);
        const deploymentScriptExecutorParams = {context, envVarsFormatter, scriptExecutor};
        const deploymentScriptExecutor = new DeploymentScriptExecutor(deploymentScriptExecutorParams);
        return new ExecuteScriptStep({context, deploymentScriptExecutor, envVarsFormatter, scriptName});
    }

    _derefTaskAttributesStep() {
        const context = this._context;
        const objectResolver = new ObjectResolver();
        return new DerefTaskAttributesStep({context, objectResolver});
    }

    _provisionCfStackStep() {
        const awsHelpers = this._awsHelpers();
        const context = this._context;
        const fileReader = this._fileReader();
        const stackNameExpander = this._stackNameExpander();
        return new ProvisionCfStackStep({awsHelpers, context, fileReader, fs, stackNameExpander});
    }

    _fileReader() {
        return new JsonCompatibleFileReader();
    }

    _stackNameExpander() {
        return new StackNameExpander({context: this._context});
    }

    _scriptExecutor(logger) {
        return new ScriptExecutor({logger, runScript});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }
}

module.exports = TaskFactory;
