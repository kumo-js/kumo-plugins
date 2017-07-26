'use strict';

class S3DataSource {

    constructor(params) {
        this._bucket = params.bucket;
        this._key = params.key;
        this._region = params.region;
        this._awsHelpers = params.awsHelpers;
    }

    fetchData() {
        const params = [{Bucket: this._bucket, Prefix: this._key}];
        return this._s3().mergeContents(params);
    }

    _s3() {
        return this._awsHelpers.s3({region: this._region});
    }
}

module.exports = S3DataSource;
