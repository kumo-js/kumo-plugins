
'use strict';

class OutputPackageLocationsStep {

    constructor(params) {
        this._context = params.context;
        this._fs = params.fs;
    }

    execute(state) {
        const packages = this._getPackagesAsMap(state.packages);
        return this._fs.writeFileAsync(this._outputPath, this._getOutputString(packages))
            .then(() => state);
    }

    _getPackagesAsMap(packageList) {
        return packageList.reduce(
            (memo, pkg) => Object.assign(memo, {[pkg.lambdaName]: this._getS3Path(pkg.packageName)}),
            {}
        );
    }

    _getS3Path(packageName) {
        return `s3://${this._bucketName}/${packageName}`;
    }

    _getOutputString(packages) {
        return JSON.stringify(packages, null, 2) + '\n';
    }

    get _bucketName() {
        return this._context.settings.uploadBucket.name;
    }

    get _outputPath() {
        return this._context.settings.args.output;
    }

}

module.exports = OutputPackageLocationsStep;
