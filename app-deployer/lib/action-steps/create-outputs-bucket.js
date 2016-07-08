'use strict';

class CreateOutputsBucket {

    constructor(params) {
        this._context = params.context;
        this._s3Helper = params.s3Helper;
    }

    execute(state) {
        return this._bucketExists()
            .then(exists => !exists ? this._createBucket() : null)
            .then(() => state);
    }

    _bucketExists() {
        return this._s3Helper.bucketExists(this._outputsBucketName());
    }

    _createBucket() {
        return this._s3Helper.createBucket({Bucket: this._outputsBucketName()});
    }

    _outputsBucketName() {
        return this._context.settings().outputsBucket().name;
    }
}

module.exports = CreateOutputsBucket;
