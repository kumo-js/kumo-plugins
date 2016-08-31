'use strict';

const fs = require('fs'),
    runScript = require('command-promise'),
    AwsHelpers = require('../../common-lib/aws-helpers'),
    AppChainOutputsCollector = require('./app-chain-outputs-collector'),
    CollectAppChainOutputsStep = require('./action-steps/collect-app-chain-outputs'),
    CollectConfigStep = require('./action-steps/collect-config'),
    CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket'),
    DirChainBuilder = require('../../common-lib/dir-chain-builder'),
    ExpandTaskDefsStep = require('./action-steps/expand-task-defs'),
    ExecuteTasksStep = require('./action-steps/execute-tasks'),
    EnvVarsFormatter = require('../../common-lib/env-vars-formatter'),
    OutputsStoreFactory = require('./outputs-store-factory'),
    PluginContext = require('./plugin-context'),
    SanitizeOutputsStep = require('./action-steps/sanitize-outputs'),
    SettingsFileReader = require('./settings-file-reader'),
    ScriptExecutor = require('../../common-lib/script-executor'),
    StepsExecutor = require('../../common-lib/steps-executor'),
    TaskFactory = require('./task-factory'),
    TaskExecutor = require('./task-executor'),
    TaskUndoer = require('./task-undoer'),
    UndoTasksStep = require('./action-steps/undo-tasks');

// TODO: Simplify / break down this class ??

class ActionFactory {

    createDeployAction(params) {
        const context = this._pluginContext(params);
        return new StepsExecutor({
            steps: [
                this._createOutputsBucketStep(context),
                this._collectAppChainOutputsStep(context, params),
                this._collectConfigStep(context),
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
                this._collectConfigStep(context),
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

    _collectConfigStep(context) {
        const scriptExecutor = this._scriptExecutor(context);
        return new CollectConfigStep({context, scriptExecutor});
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

    _scriptExecutor(context) {
        const logger = context.logger();
        const options = {envVarsFormatter: new EnvVarsFormatter({})};
        return new ScriptExecutor({logger, runScript, options});
    }

    _taskFactory(context) {
        return new TaskFactory({context});
    }
}

module.exports = ActionFactory;
