'use strict';

const runScript = require('command-promise');
const AwsHelpers = require('../../../common-lib/aws-helpers');
const AppChainBuilder = require('./app-chain-builder');
const CollectAppChainOutputsStep = require('./action-steps/collect-app-chain-outputs');
const CollectAppChainConfigStep = require('./action-steps/collect-app-chain-config');
const CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket');
const DirChainBuilder = require('../../../common-lib/dir-chain-builder');
const ExpandTaskDefsStep = require('./action-steps/expand-task-defs');
const ExecuteTasksStep = require('./action-steps/execute-tasks');
const EnvVarsFormatter = require('../../../common-lib/env-vars-formatter');
const JsonCompatibleFileReader = require('../../../common-lib/json-compatible-file-reader');
const OutputsStoreFactory = require('./outputs-store-factory');
const SanitizeOutputsStep = require('./action-steps/sanitize-outputs');
const ScriptExecutor = require('../../../common-lib/script-executor');
const StepsExecutor = require('../../../common-lib/steps-executor');
const TaskFactory = require('./task-factory');
const TaskService = require('./task-service');
const UndoTasksStep = require('./action-steps/undo-tasks');

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

    _appChainBuilder(context) {
        const fileReader = this._fileReader();
        const dirChainBuilder = new DirChainBuilder({fileReader});
        return new AppChainBuilder({context, dirChainBuilder, fileReader});
    }

    _scriptExecutor(context) {
        const logger = context.logger;
        const options = {envVarsFormatter: new EnvVarsFormatter({})};
        return new ScriptExecutor({logger, runScript, options});
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

    _fileReader() {
        return new JsonCompatibleFileReader();
    }

    _outputsStoreFactory() {
        const awsHelpers = this._awsHelpers();
        return new OutputsStoreFactory({awsHelpers});
    }
}

module.exports = ActionFactory;
