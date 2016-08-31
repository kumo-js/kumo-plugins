'use strict';

const _ = require('lodash');

class S3Helper {

    constructor(params) {
        this._s3 = params.s3;
    }

    bucketExists(name) {
        return this._s3.headBucket({Bucket: name}).promise().then(
            () => true, err => {
                if (err.statusCode !== 404) throw err;
                return false;
            }
        );
    }

    createBucket(params) {
        return this._s3.createBucket(params).promise();
    }

    putObject(params) {
        return this._s3.putObject(params).promise();
    }

    deleteObject(params) {
        return this._s3.deleteObject(params).promise();
    }

    deleteObjects(params) {
        return this._s3.deleteObjects(params).promise();
    }

    listObjects(params) {
        return this._listObjectsInBuckets([params])
            .then(items => _.reject(items, i => i.Key === params.Prefix));
    }

    mergeContents(buckets) {
        return this._listObjectsInBuckets(buckets)
            .then(items => this._fetch(items))
            .then(contents => this._merge(contents));
    }

    _listObjectsInBuckets(buckets) {
        return Promise.all(buckets.map(bucket => {
            return this._s3.listObjects(bucket).promise().then(response =>
                response.Contents.map(obj => Object.assign({Bucket: bucket.Bucket, Key: obj.Key}))
            )
        })).then(items => _.flatten(items));
    }

    _fetch(items) {
        return Promise.all(items.map(item =>
            this._s3.getObject(item).promise().then(obj => obj.Body.toString())
        ));
    }

    _merge(contents) {
        return contents.reduce((result, content) => {
            const parsedContent = content ? JSON.parse(content) : {};
            return _.merge(result, parsedContent);
        }, {});
    }
}

module.exports = S3Helper;
