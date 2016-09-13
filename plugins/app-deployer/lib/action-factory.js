'use strict';

const runScript = require('command-promise'),
    AwsHelpers = require('../../../common-lib/aws-helpers'),
    AppChainBuilder = require('./app-chain-builder'),
    CollectAppChainOutputsStep = require('./action-steps/collect-app-chain-outputs'),
    CollectAppChainConfigStep = require('./action-steps/collect-app-chain-config'),
    CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket'),
    DirChainBuilder = require('../../../common-lib/dir-chain-builder'),
    ExpandTaskDefsStep = require('./action-steps/expand-task-defs'),
    ExecuteTasksStep = require('./action-steps/execute-tasks'),
    EnvVarsFormatter = require('../../../common-lib/env-vars-formatter'),
    JsonCompatibleFileReader = require('../../../common-lib/json-compatible-file-reader'),
    OutputsStoreFactory = require('./outputs-store-factory'),
    SanitizeOutputsStep = require('./action-steps/sanitize-outputs'),
    ScriptExecutor = require('../../../common-lib/script-executor'),
    StepsExecutor = require('../../../common-lib/steps-executor'),
    TaskFactory = require('./task-factory'),
    TaskExecutor = require('./task-executor'),
    TaskUndoer = require('./task-undoer'),
    UndoTasksStep = require('./action-steps/undo-tasks');

// TODO: Break down this class ??

class ActionFactory {

    createDeployAction(context) {
        return new StepsExecutor({
            steps: [
                this._createOutputsBucketStep(context),
                this._collectAppChainOutputsStep(context),
                this._collectAppChainConfigStep(context),
                this._expandTaskDefsStep(context),
                this._executeTasksStep(context),
                this._sanitizeOutputsStep(context)
            ]
        });
    }

    createDestroyAction(context) {
        return new StepsExecutor({
            steps: [
                this._collectAppChainOutputsStep(context),
                this._collectAppChainConfigStep(context),
                this._expandTaskDefsStep(context),
                this._undoTasksStep(context)
            ]
        });
    }

    _createOutputsBucketStep(context) {
        const awsHelpers = this._awsHelpers();
        return new CreateOutputsBucketStep({awsHelpers, context});
    }

    _collectAppChainOutputsStep(context) {
        const appChainBuilder = this._appChainBuilder(context);
        const outputsStoreFactory = this._outputsStoreFactory();
        return new CollectAppChainOutputsStep({appChainBuilder, context, outputsStoreFactory});
    }

    _collectAppChainConfigStep(context) {
        const appChainBuilder = this._appChainBuilder(context);
        const scriptExecutor = this._scriptExecutor(context);
        return new CollectAppChainConfigStep({appChainBuilder, context, scriptExecutor});
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

    _appChainBuilder(context) {
        const fileReader = this._fileReader();
        const dirChainBuilder = new DirChainBuilder({fileReader});
        return new AppChainBuilder({context, dirChainBuilder, fileReader})
    }

    _scriptExecutor(context) {
        const logger = context.logger;
        const options = {envVarsFormatter: new EnvVarsFormatter({})};
        return new ScriptExecutor({logger, runScript, options});
    }

    _taskFactory(context) {
        return new TaskFactory({context});
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
}

module.exports = ActionFactory;
