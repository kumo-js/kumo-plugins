
'use strict';

class CreateUploadBucketStep {

    constructor(params) {
        this._context = params.context;
        this._awsHelpers = params.awsHelpers;
    }

    execute(state) {
        return this._bucketExists()
            .then(exists => !exists ? this._createBucket() : null)
            .then(() => state);
    }

    _bucketExists() {
        return this._s3Helper.bucketExists(this._uploadBucket.name);
    }

    _createBucket() {
        return this._s3Helper.createBucket({Bucket: this._uploadBucket.name});
    }

    get _s3Helper() {
        return this._awsHelpers.s3({region: this._uploadBucket.region});
    }

    get _uploadBucket() {
        return this._context.settings.uploadBucket;
    }
}

module.exports = CreateUploadBucketStep;
