'use strict';

const runScript = require('command-promise'),
    AwsHelpers = require('../../common-lib/aws-helpers'),
    AppChainBuilder = require('./app-chain-builder'),
    CollectAppChainOutputsStep = require('./action-steps/collect-app-chain-outputs'),
    CollectAppChainConfigStep = require('./action-steps/collect-app-chain-config'),
    CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket'),
    DirChainBuilder = require('../../common-lib/dir-chain-builder'),
    ExpandTaskDefsStep = require('./action-steps/expand-task-defs'),
    ExecuteTasksStep = require('./action-steps/execute-tasks'),
    EnvVarsFormatter = require('../../common-lib/env-vars-formatter'),
    JsonCompatibleFileReader = require('../../common-lib/json-compatible-file-reader'),
    OutputsStoreFactory = require('./outputs-store-factory'),
    SanitizeOutputsStep = require('./action-steps/sanitize-outputs'),
    SettingsFileReader = require('./settings-file-reader'),
    ScriptExecutor = require('../../common-lib/script-executor'),
    StepsExecutor = require('../../common-lib/steps-executor'),
    TaskFactory = require('./task-factory'),
    TaskExecutor = require('./task-executor'),
    TaskUndoer = require('./task-undoer'),
    UndoTasksStep = require('./action-steps/undo-tasks');

class ActionFactory {

    constructor(params) {
        this._context = params.context;
    }

    createDeployAction() {
        return new StepsExecutor({
            steps: [
                this._createOutputsBucketStep(),
                this._collectAppChainOutputsStep(),
                this._collectAppChainConfigStep(),
                this._expandTaskDefsStep(),
                this._executeTasksStep(),
                this._sanitizeOutputsStep()
            ]
        });
    }

    createDestroyAction() {
        return new StepsExecutor({
            steps: [
                this._collectAppChainOutputsStep(),
                this._collectAppChainConfigStep(),
                this._expandTaskDefsStep(),
                this._undoTasksStep()
            ]
        });
    }

    _createOutputsBucketStep() {
        const awsHelpers = this._awsHelpers();
        const context = this._context;
        return new CreateOutputsBucketStep({awsHelpers, context});
    }

    _collectAppChainOutputsStep() {
        const appChainBuilder = this._appChainBuilder();
        const context = this._context;
        const outputsStoreFactory = this._outputsStoreFactory();
        return new CollectAppChainOutputsStep({appChainBuilder, context, outputsStoreFactory});
    }

    _collectAppChainConfigStep() {
        const appChainBuilder = this._appChainBuilder();
        const context = this._context;
        const scriptExecutor = this._scriptExecutor();
        return new CollectAppChainConfigStep({appChainBuilder, context, scriptExecutor});
    }

    _expandTaskDefsStep() {
        const context = this._context;
        return new ExpandTaskDefsStep({context});
    }

    _executeTasksStep() {
        const context = this._context;
        const outputsStoreFactory = this._outputsStoreFactory();
        const taskFactory = this._taskFactory();
        const taskExecutor = new TaskExecutor({context, outputsStoreFactory, taskFactory});
        return new ExecuteTasksStep({taskExecutor});
    }

    _undoTasksStep() {
        const context = this._context;
        const outputsStoreFactory = this._outputsStoreFactory();
        const taskFactory = this._taskFactory();
        const taskUndoer = new TaskUndoer({context, outputsStoreFactory, taskFactory});
        return new UndoTasksStep({taskUndoer});
    }

    _sanitizeOutputsStep() {
        const context = this._context;
        const outputsStoreFactory = this._outputsStoreFactory();
        return new SanitizeOutputsStep({context, outputsStoreFactory});
    }

    _appChainBuilder() {
        const context = this._context;
        const fileReader = this._fileReader();
        const dirChainBuilder = new DirChainBuilder({fileReader});
        const settingsFileReader = this._settingsFileReader();
        return new AppChainBuilder({context, dirChainBuilder, settingsFileReader})
    }

    _awsHelpers() {
        return new AwsHelpers();
    }

    _fileReader() {
        return new JsonCompatibleFileReader();
    }

    _outputsStoreFactory() {
        const awsHelpers = this._awsHelpers();
        return new OutputsStoreFactory({awsHelpers});
    }

    _scriptExecutor() {
        const logger = this._context.logger;
        const options = {envVarsFormatter: new EnvVarsFormatter({})};
        return new ScriptExecutor({logger, runScript, options});
    }

    _settingsFileReader() {
        const fileReader = this._fileReader();
        const kumoSettings = this._context.kumoContext.settings();
        const options = this._context.options;
        return new SettingsFileReader({fileReader, kumoSettings, options});
    }

    _taskFactory() {
        return new TaskFactory({context: this._context});
    }
}

module.exports = ActionFactory;
