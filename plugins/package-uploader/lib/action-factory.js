
'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const runScript = require('command-promise');
const tempfile = require('tempfile2');
const AwsHelpers = require('../../../common-lib/lib/aws-helpers');
const StepsExecutor = require('../../../common-lib/lib/steps-executor');
const CreateUploadBucketStep = require('./steps/create-upload-bucket');
const PackageStep = require('./steps/package');
const Packager = require('./packager');
const UploadPackagesStep = require('./steps/upload-packages');
const OutputPackageLocationsStep = require('./steps/output-package-locations');
const PackageNameBuilder = require('./package-name-builder');
const EnvVarsFormatter = require('../../../common-lib/lib/env-vars-formatter');
const ScriptExecutor = require('../../../common-lib/lib/script-executor');

class ActionFactory {

    createUploadPackageAction(context) {
        return new StepsExecutor({
            steps: [
                this._createUploadBucketStep(context),
                this._createPackageStep(context),
                this._createUploadPackagesStep(context),
                this._createOutputPackageLocationsStep(context)
            ]
        });
    }

    _createUploadBucketStep(context) {
        return new CreateUploadBucketStep({
            awsHelpers: this._getAwsHelpers(),
            context
        });
    }

    _createPackageStep(context) {
        return new PackageStep({
            context,
            packager: this._createPackager(context)
        });
    }

    _createUploadPackagesStep(context) {
        return new UploadPackagesStep({
            awsHelpers: this._getAwsHelpers(),
            context
        });
    }

    _createOutputPackageLocationsStep(context) {
        return new OutputPackageLocationsStep({context, fs});
    }

    _createPackager(context) {
        return new Packager({
            fs,
            packageNameBuilder: this._createPackageNameBuilder(context.settings),
            scriptExecutor: this._createScriptExecutor(context.logger),
            generateTempFilePath: tempfile
        });
    }

    _createPackageNameBuilder(settings) {
        const args = settings.args;
        return new PackageNameBuilder({
            env: args.env,
            buildNumber: args['build-number']
        });
    }

    _createScriptExecutor(logger) {
        const options = {envVarsFormatter: new EnvVarsFormatter({})};
        return new ScriptExecutor({logger, runScript, options});
    }

    _getAwsHelpers() {
        this._awsHelpers = this._awsHelpers || new AwsHelpers();
        return this._awsHelpers;
    }

}

module.exports = ActionFactory;
