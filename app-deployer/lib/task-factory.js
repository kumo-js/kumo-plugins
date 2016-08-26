'use strict';

const fs = require('fs');
const AwsHelpers = require('../../common-lib/aws-helpers');
const DeleteCfStackStep = require('./task-steps/delete-cf-stack');
const CollectOutputsStep = require('./task-steps/collect-outputs');
const CreateEnvVarsStep = require('./task-steps/create-env-vars');
const CreateCfEnvVarsStep = require('./task-steps/create-cf-env-vars');
const ExecuteScriptStep = require('./task-steps/execute-script');
const InitTaskStep = require('./task-steps/init-task');
const ProvisionCfStackStep = require('./task-steps/provision-cf-stack');
const Shell = require('../../common-lib/shell');
const StepsExecutor = require('../../common-lib/steps-executor');
const StackNameExpander = require('./stack-name-expander');

// TODO: Simplify / break down this class

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

    _createTask(params, stepCreatorsFn) {
        const stepCreators = stepCreatorsFn.call(this);
        const stepCreator = stepCreators[params.taskDef.type];
        const steps = stepCreator.call(this);
        return new StepsExecutor({initialState: params, steps: steps});
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
            this._executeScriptStep(),
            this._collectOutputsStep()
        ]
    }

    _undoCfTaskSteps() {
        return [this._deleteCfStackStep()];
    }

    _undoCustomTaskSteps() {
        return [
            this._initStep(),
            this._createEnvVarsStep(),
            this._executeScriptStep({scriptType: 'undo'})
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

    _collectOutputsStep() {
        return new CollectOutputsStep({fs});
    }

    _deleteCfStackStep() {
        const awsHelpers = this._awsHelpers();
        const stackNameExpander = this._stackNameExpander();
        return new DeleteCfStackStep({awsHelpers, stackNameExpander});
    }

    _executeScriptStep(options) {
        const context = this._context;
        const shell = new Shell({logger: context.logger()});
        return new ExecuteScriptStep({context, options, shell});
    }

    _provisionCfStackStep() {
        const awsHelpers = this._awsHelpers();
        const stackNameExpander = this._stackNameExpander();
        return new ProvisionCfStackStep({awsHelpers, fs, stackNameExpander});
    }

    _stackNameExpander() {
        const context = this._context;
        return new StackNameExpander({context});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }
}

module.exports = TaskFactory;
