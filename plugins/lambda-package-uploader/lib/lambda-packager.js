
'use strict';

class LambdaPackager {

    constructor(params) {
        this._fs = params.fs;
        this._packageNameBuilder = params.packageNameBuilder;
        this._scriptExecutor = params.scriptExecutor;
        this._generateTempFilePath = params.generateTempFilePath;
    }

    package(packagingConfig) {
        return Promise.resolve({packagingConfig})
            .then(state => this._buildPackageFileName(state))
            .then(state => this._buildPackageFilePath(state))
            .then(state => this._package(state))
            .then(state => this._loadPackgeFile(state))
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
            packagePath: this._generateTempFilePath({ext: '.zip'})
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

    _loadPackgeFile(state) {
        return this._fs.readFileAsync(state.packagePath)
            .then(zipData => Object.assign({}, state, {zipData}));
    }

}

module.exports = LambdaPackager;
