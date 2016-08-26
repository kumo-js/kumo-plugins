'use strict';

const fs = require('fs');
const AwsHelpers = require('../../common-lib/aws-helpers');
const AppChainOutputsCollector = require('./app-chain-outputs-collector');
const CollectAppChainOutputsStep = require('./action-steps/collect-app-chain-outputs');
const CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket');
const DirChainBuilder = require('../../common-lib/dir-chain-builder');
const ExpandTaskDefsStep = require('./action-steps/expand-task-defs');
const ExecuteTasksStep = require('./action-steps/execute-tasks');
const OutputsStoreFactory = require('./outputs-store-factory');
const PluginContext = require('./plugin-context');
const SanitizeOutputsStep = require('./action-steps/sanitize-outputs');
const SettingsFileReader = require('./settings-file-reader');
const StepsExecutor = require('../../common-lib/steps-executor');
const TaskFactory = require('./task-factory');
const TaskExecutor = require('./task-executor');
const TaskUndoer = require('./task-undoer');
const UndoTasksStep = require('./action-steps/undo-tasks');

class ActionFactory {

    createDeployAction(params) {
        const context = this._pluginContext(params);
        return new StepsExecutor({
            steps: [
                this._createOutputsBucketStep(context),
                this._collectAppChainOutputsStep(context, params),
                this._expandTaskDefsStep(context),
                this._executeTasksStep(context),
                this._sanitizeOutputsStep(context)
            ]
        });
    }

    createDestroyAction(params) {
        const context = this._pluginContext(params);
        return new StepsExecutor({
            steps: [
                this._collectAppChainOutputsStep(context, params),
                this._expandTaskDefsStep(context),
                this._undoTasksStep(context)
            ]
        });
    }

    _pluginContext(actionParams) {
        const settingsReader = this._settingsFileReader(actionParams);
        const params = Object.assign({}, actionParams, {fs, settingsReader});
        return new PluginContext(params);
    }

    _createOutputsBucketStep(context) {
        const awsHelpers = this._awsHelpers();
        return new CreateOutputsBucketStep({awsHelpers, context});
    }

    _collectAppChainOutputsStep(context, actionParams) {
        const appChainOutputsCollector = this._appChainOutputsCollector(actionParams);
        return new CollectAppChainOutputsStep({context, fs, appChainOutputsCollector});
    }

    _expandTaskDefsStep(context) {
        return new ExpandTaskDefsStep({context});
    }

    _executeTasksStep(context) {
        const outputsStoreFactory = this._outputsStoreFactory();
        const taskFactory = this._taskFactory(context);
        const taskExecutor = new TaskExecutor({context, outputsStoreFactory, taskFactory});
        return new ExecuteTasksStep({taskExecutor});
    }

    _undoTasksStep(context) {
        const outputsStoreFactory = this._outputsStoreFactory();
        const taskFactory = this._taskFactory(context);
        const taskUndoer = new TaskUndoer({context, outputsStoreFactory, taskFactory});
        return new UndoTasksStep({taskUndoer});
    }

    _sanitizeOutputsStep(context) {
        const outputsStoreFactory = this._outputsStoreFactory();
        return new SanitizeOutputsStep({context, outputsStoreFactory});
    }

    _appChainOutputsCollector(actionParams) {
        const dirChainBuilder = new DirChainBuilder({fs});
        const outputsStoreFactory = this._outputsStoreFactory();
        const settingsFileReader = this._settingsFileReader(actionParams);
        return new AppChainOutputsCollector({dirChainBuilder, outputsStoreFactory, settingsFileReader});
    }

    _outputsStoreFactory() {
        const awsHelpers = this._awsHelpers();
        return new OutputsStoreFactory({awsHelpers});
    }

    _settingsFileReader(actionParams) {
        const kumoSettings = actionParams.kumoContext.settings();
        const options = actionParams.options;
        return new SettingsFileReader({fs, kumoSettings, options});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }

    _taskFactory(context) {
        return new TaskFactory({context});
    }
}

module.exports = ActionFactory;
