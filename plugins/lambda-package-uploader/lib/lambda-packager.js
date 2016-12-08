
'use strict';

const path = require('path');

const LOCAL_PACKAGE_OUTPUT_DIR = '.';   // How should it be passed?
const ENV_FILE_NAME = 'env.json';

class LambdaPackager {

    constructor(params) {
        this._packageNameBuilder = params.packageNameBuilder;
        this._scriptExecutor = params.scriptExecutor;
        this._zipHelper = params.zipHelper;
    }

    package(packagingConfig) {
        return Promise.resolve({packagingConfig})
            .then(state => this._buildPackageFileName(state))
            .then(state => this._buildPackageFilePath(state))
            .then(state => this._package(state))
            .then(state => this._injectEnvFileIntoPackage(state))
            .then(state => ({
                lambdaName: state.packagingConfig.name,
                packageName: state.packageName,
                packageData: state.zipData
            }));
    }

    _buildPackageFileName(state) {
        return Object.assign({}, state, {
            packageName: this._packageNameBuilder.build(state.packagingConfig.name)
        });
    }

    _buildPackageFilePath(state) {
        return Object.assign({}, state, {
            packagePath: path.join(LOCAL_PACKAGE_OUTPUT_DIR, state.packageName)
        });
    }

    _package(state) {
        const scriptOptions = {
            cwd: module.dir,    // XXX: Do not use module.dir
            envVars: {
                KUMO_PACKAGE_OUTPUT_FILE: state.packagePath
            },
            logOutput: false
        };
        return this._scriptExecutor.execute(state.packagingConfig['package-script'], scriptOptions)
            .then(() => state);
    }

    _injectEnvFileIntoPackage(state) {
        const params = {
            zipPath: state.packagePath,
            pathInZip: ENV_FILE_NAME,
            data: JSON.stringify(state.packagingConfig.envFile)
        };
        return this._zipHelper.addDataToZip(params)
            .then(zipData => Object.assign({}, state, {zipData}));
    }

}

module.exports = LambdaPackager;
