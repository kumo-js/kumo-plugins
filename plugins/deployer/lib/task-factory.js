'use strict';

const fs = require('fs');
const runScript = require('command-promise');
const AwsHelpers = require('../../../common-lib/lib/aws-helpers');
const DeleteCfStackStep = require('./task-steps/delete-cf-stack');
const DeploymentScriptExecutor = require('./deployment-script-executor');
const CollectTaskOutputsStep = require('./task-steps/collect-task-outputs');
const CreateTaskVarsStep = require('./task-steps/create-task-vars');
const CreateCfTaskVarsStep = require('./task-steps/create-cf-task-vars');
const ExecuteScriptStep = require('./task-steps/execute-script');
const JsonCompatibleFileReader = require('../../../common-lib/lib/json-compatible-file-reader');
const ProvisionCfStackStep = require('./task-steps/provision-cf-stack');
const ResolveTaskDefStep = require('./task-steps/resolve-task-def');
const ScriptExecutor = require('../../../common-lib/lib/script-executor');
const StepsExecutor = require('../../../common-lib/lib/steps-executor');

class TaskFactory {

    constructor(params) {
        this._context = params.context;
    }

    createTask(taskSection) {
        return this._createTask(taskSection, () => ({
            'cf-stack': this._cfTaskSteps,
            custom: this._customTaskSteps
        }));
    }

    createUndoTask(taskSection) {
        return this._createTask(taskSection, () => ({
            'cf-stack': this._undoCfTaskSteps,
            custom: this._undoCustomTaskSteps
        }));
    }

    _createTask(taskSection, getStepCreators) {
        const taskType = taskSection.getValue().type || 'custom';
        const stepCreators = getStepCreators();
        const stepCreator = stepCreators[taskType];
        const steps = stepCreator.call(this);
        return new StepsExecutor({initialState: {taskSection}, steps: steps});
    }

    _cfTaskSteps() {
        return [
            this._createTaskVarsStep(),
            this._createCfTaskVarsStep(),
            this._resolveTaskDef(),
            this._executeScriptStep('stackTemplate'),
            this._provisionCfStackStep(),
            this._collectTaskOutputsStep()
        ];
    }

    _customTaskSteps() {
        return [
            this._createTaskVarsStep(),
            this._resolveTaskDef(),
            this._executeScriptStep('run'),
            this._collectTaskOutputsStep()
        ];
    }

    _undoCfTaskSteps() {
        return [
            this._createTaskVarsStep(),
            this._resolveTaskDef(),
            this._deleteCfStackStep()
        ];
    }

    _undoCustomTaskSteps() {
        return [
            this._createTaskVarsStep(),
            this._resolveTaskDef(),
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

    _resolveTaskDef() {
        return new ResolveTaskDefStep();
    }

    _collectTaskOutputsStep() {
        const fileReader = this._fileReader();
        return new CollectTaskOutputsStep({fileReader});
    }

    _deleteCfStackStep() {
        const awsHelpers = this._awsHelpers();
        const context = this._context;
        return new DeleteCfStackStep({awsHelpers, context});
    }

    _executeScriptStep(scriptName) {
        const context = this._context;
        const scriptExecutor = this._scriptExecutor(context.logger);
        const deploymentScriptExecutor = new DeploymentScriptExecutor({scriptExecutor});
        return new ExecuteScriptStep({context, deploymentScriptExecutor, scriptName});
    }

    _provisionCfStackStep() {
        const awsHelpers = this._awsHelpers();
        const context = this._context;
        const fileReader = this._fileReader();
        return new ProvisionCfStackStep({awsHelpers, context, fileReader, fs});
    }

    _fileReader() {
        return new JsonCompatibleFileReader();
    }

    _scriptExecutor(logger) {
        return new ScriptExecutor({logger, runScript});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }
}

module.exports = TaskFactory;
