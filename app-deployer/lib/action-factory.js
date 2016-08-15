'use strict';

const _ = require('lodash');
const aws = require('aws-sdk');
const fs = require('fs');
const s3 = new aws.S3();
const AppChainOutputsCollector = require('./app-chain-outputs-collector');
const CollectAppChainOutputsStep = require('./action-steps/collect-app-chain-outputs');
const CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket');
const DirChainBuilder = require('../../common-lib/dir-chain-builder');
const ExpandTaskDefsStep = require('./action-steps/expand-task-defs');
const ExecuteTasksStep = require('./action-steps/execute-tasks');
const OutputsStoreFactory = require('./outputs-store-factory');
const PluginContext = require('./plugin-context');
const S3Helper = require('../../common-lib/s3-helper');
const SettingsFileReader = require('./settings-file-reader');
const StepsExecutor = require('../../common-lib/steps-executor');
const TaskExecutor = require('./task-executor');
const TaskFactory = require('./task-factory');

class ActionFactory {

    createDeployAction(params) {
        const context = this._pluginContext(params);
        return new StepsExecutor({
            steps: [
                this._createOutputsBucketStep(context),
                this._collectAppChainOutputsStep(context, params),
                this._expandTaskDefsStep(context),
                this._executeTasksStep(context)
            ]
        });
    }

    _pluginContext(actionParams) {
        const settingsReader = this._settingsFileReader(actionParams);
        return new PluginContext(_.assign({}, actionParams, {fs, settingsReader}));
    }

    _createOutputsBucketStep(context) {
        const s3Helper = this._s3Helper();
        return new CreateOutputsBucketStep({context, s3Helper});
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

    _appChainOutputsCollector(actionParams) {
        const dirChainBuilder = new DirChainBuilder({fs});
        const outputsStoreFactory = this._outputsStoreFactory();
        const settingsFileReader = this._settingsFileReader(actionParams);
        return new AppChainOutputsCollector({dirChainBuilder, outputsStoreFactory, settingsFileReader});
    }

    _outputsStoreFactory() {
        const s3Helper = this._s3Helper();
        return new OutputsStoreFactory({s3Helper});
    }

    _settingsFileReader(actionParams) {
        const kumoSettings = actionParams.kumoContext.settings();
        return new SettingsFileReader({fs, kumoSettings});
    }

    _s3Helper() {
        return new S3Helper({s3});
    }

    _taskFactory(context) {
        return new TaskFactory({context});
    }
}

module.exports = ActionFactory;
