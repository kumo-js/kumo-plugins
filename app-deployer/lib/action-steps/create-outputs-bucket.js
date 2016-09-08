'use strict';

class CreateOutputsBucket {

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
        return this._s3Helper().bucketExists(this._outputsBucket().name);
    }

    _createBucket() {
        return this._s3Helper().createBucket({Bucket: this._outputsBucket().name});
    }

    _s3Helper() {
        return this._awsHelpers.s3({region: this._outputsBucket().region});
    }

    _outputsBucket() {
        return this._context.settings.outputsBucket();
    }
}

module.exports = CreateOutputsBucket;
