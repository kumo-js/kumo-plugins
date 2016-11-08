'use strict';

const runScript = require('command-promise');
const AwsHelpers = require('../../../common-lib/aws-helpers');
const ModuleChainBuilder = require('./module-chain-builder');
const CollectDeploymentOutputsStep = require('./action-steps/collect-deployment-outputs');
const CollectDeploymentConfigStep = require('./action-steps/collect-deployment-config');
const CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket');
const DirChainBuilder = require('../../../common-lib/dir-chain-builder');
const DeploymentScriptExecutor = require('./deployment-script-executor');
const ExpandTaskDefsStep = require('./action-steps/expand-task-defs');
const ExecuteTasksStep = require('./action-steps/execute-tasks');
const EnvVarsFormatter = require('../../../common-lib/env-vars-formatter');
const OutputsStoreFactory = require('./outputs-store-factory');
const SanitizeOutputsStep = require('./action-steps/sanitize-outputs');
const ScriptExecutor = require('../../../common-lib/script-executor');
const StepsExecutor = require('../../../common-lib/steps-executor');
const TaskFactory = require('./task-factory');
const TaskService = require('./task-service');
const UndoTasksStep = require('./action-steps/undo-tasks');

class ActionFactory {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._settingsBuilder = params.settingsBuilder;
    }

    createDeployAction(context) {
        return new StepsExecutor({
            steps: [
                this._createOutputsBucketStep(context),
                this._collectDeploymentOutputsStep(context),
                this._collectDeploymentConfigStep(context),
                this._expandTaskDefsStep(context),
                this._executeTasksStep(context),
                this._sanitizeOutputsStep(context)
            ]
        });
    }

    createDestroyAction(context) {
        return new StepsExecutor({
            steps: [
                this._collectDeploymentOutputsStep(context),
                this._collectDeploymentConfigStep(context),
                this._expandTaskDefsStep(context),
                this._undoTasksStep(context)
            ]
        });
    }

    _createOutputsBucketStep(context) {
        const awsHelpers = this._awsHelpers();
        return new CreateOutputsBucketStep({awsHelpers, context});
    }

    _collectDeploymentOutputsStep(context) {
        const moduleChainBuilder = this._moduleChainBuilder(context);
        const outputsStoreFactory = this._outputsStoreFactory();
        return new CollectDeploymentOutputsStep({context, moduleChainBuilder, outputsStoreFactory});
    }

    _collectDeploymentConfigStep(context) {
        const envVarsFormatter = new EnvVarsFormatter({});
        const scriptExecutor = this._scriptExecutor(context);
        const deploymentScriptExecutor = new DeploymentScriptExecutor({context, envVarsFormatter, scriptExecutor});
        const moduleChainBuilder = this._moduleChainBuilder(context);
        return new CollectDeploymentConfigStep({context, deploymentScriptExecutor, moduleChainBuilder});
    }

    _expandTaskDefsStep(context) {
        return new ExpandTaskDefsStep({context});
    }

    _executeTasksStep(context) {
        const taskService = this._taskService(context);
        return new ExecuteTasksStep({context, taskService});
    }

    _undoTasksStep(context) {
        const taskService = this._taskService(context);
        return new UndoTasksStep({taskService});
    }

    _sanitizeOutputsStep(context) {
        const outputsStoreFactory = this._outputsStoreFactory();
        return new SanitizeOutputsStep({context, outputsStoreFactory});
    }

    _moduleChainBuilder(context) {
        const fileReader = this._fileReader;
        const dirChainBuilder = new DirChainBuilder({fileReader});
        const settingsBuilder = this._settingsBuilder;
        return new ModuleChainBuilder({context, dirChainBuilder, fileReader, settingsBuilder});
    }

    _scriptExecutor(context) {
        const logger = context.logger;
        return new ScriptExecutor({logger, runScript});
    }

    _taskFactory(context) {
        return new TaskFactory({context});
    }

    _taskService(context) {
        const outputsStoreFactory = this._outputsStoreFactory();
        const taskFactory = this._taskFactory(context);
        return new TaskService({context, outputsStoreFactory, taskFactory});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }

    _outputsStoreFactory() {
        const awsHelpers = this._awsHelpers();
        return new OutputsStoreFactory({awsHelpers});
    }
}

module.exports = ActionFactory;
