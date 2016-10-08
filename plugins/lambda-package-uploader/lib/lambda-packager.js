
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
        const packagingConfig = state.packagingConfig;
        const envVars = {PACKAGE_OUTPUT_FILE: state.packagePath};
        const scriptOptions = {cwd: module.dir, env: envVars, logOutput: false};    // XXX: Do not use module.dir
        return this._scriptExecutor.execute(packagingConfig['package-script'], scriptOptions)
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
