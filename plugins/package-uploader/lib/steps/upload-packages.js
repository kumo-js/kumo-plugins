
'use strict';

class UploadPackagesStep {

    constructor(params) {
        this._context = params.context;
        this._awsHelpers = params.awsHelpers;
    }

    execute(state) {
        return this._uploadPackages(state.packages)
            .then(() => state);
    }

    _uploadPackages(packages) {
        return Promise.all(packages.map(pkg =>
            this._s3Helper.putObject({
                Bucket: this._uploadBucket.name,
                Key: pkg.finalPackageName,
                Body: pkg.packageData
            })
        ));
    }

    get _s3Helper() {
        return this._awsHelpers.s3({region: this._uploadBucket.region});
    }

    get _uploadBucket() {
        return this._context.settings.uploadBucket;
    }

}

module.exports = UploadPackagesStep;
