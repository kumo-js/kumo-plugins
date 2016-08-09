'use strict';

const _ = require('lodash');
const aws = require('aws-sdk');
const fs = require('fs');
const s3 = new aws.S3();
const CollectOutputsStep = require('./action-steps/collect-outputs');
const CreateOutputsBucketStep = require('./action-steps/create-outputs-bucket');
const DirChainBuilder = require('../../common-lib/dir-chain-builder');
const ExpandTaskDefsStep = require('./action-steps/expand-task-defs');
const OutputsCollector = require('./outputs-collector');
const OutputsStoreFactory = require('./outputs-store-factory');
const PluginContext = require('./plugin-context');
const S3Helper = require('../../common-lib/s3-helper');
const SettingsFileReader = require('./settings-file-reader');
const StepsExecutor = require('../../common-lib/steps-executor');

class ActionFactory {

    createDeployAction(params) {
        const context = this._pluginContext(params);
        return new StepsExecutor({
            steps: [
                this._createOutputsBucketStep(context),
                this._collectOutputsStep(context, params),
                this._expandTaskDefsStep(context)
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

    _collectOutputsStep(context, actionParams) {
        const outputsCollector = this._outputsCollector(actionParams);
        return new CollectOutputsStep({context, fs, outputsCollector});
    }

    _expandTaskDefsStep(context) {
        return new ExpandTaskDefsStep({context});
    }

    _outputsCollector(actionParams) {
        const dirChainBuilder = new DirChainBuilder({fs});
        const s3Helper = this._s3Helper();
        const outputsStoreFactory = new OutputsStoreFactory({s3Helper});
        const settingsFileReader = this._settingsFileReader(actionParams);
        return new OutputsCollector({dirChainBuilder, outputsStoreFactory, settingsFileReader});
    }

    _settingsFileReader(actionParams) {
        const kumoSettings = actionParams.kumoContext.settings();
        return new SettingsFileReader({fs, kumoSettings});
    }

    _s3Helper() {
        return new S3Helper({s3});
    }
}

module.exports = ActionFactory;
