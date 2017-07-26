'use strict';

const _ = require('lodash');

class S3OutputsStore {

    constructor(params) {
        this._bucket = params.bucket;
        this._prefix = params.prefix || '';
        this._region = params.region;
        this._awsHelpers = params.awsHelpers;
    }

    initialise() {
        return this._s3Helper().bucketExists(this._bucket).then(
            exists => !exists ? this._s3Helper().createBucket({Bucket: this._bucket}) : null
        );
    }

    collect() {
        return this._s3Helper().mergeContents([{
            Bucket: this._bucket,
            Prefix: this._prefix
        }]);
    }

    save(id, outputs) {
        return this._s3Helper().putObject({
            Bucket: this._bucket,
            Key: this._getKey(id),
            Body: JSON.stringify(outputs)
        });
    }

    remove(id) {
        return this._s3Helper().deleteObject({
            Bucket: this._bucket,
            Key: this._getKey(id)
        });
    }

    removeAllExcept(ids) {
        return this._listItems()
            .then(items => items.map(i => i.Key))
            .then(keys => this._getInvalidKeys(keys, ids))
            .then(keysToRemove => this._deleteObjects(keysToRemove));
    }

    _listItems() {
        return this._s3Helper().listObjects({
            Bucket: this._bucket,
            Prefix: this._prefix
        });
    }

    _deleteObjects(keys) {
        return keys.length === 0 ?
            Promise.resolve() :
            this._s3Helper().deleteObjects({
                Bucket: this._bucket,
                Delete: {Objects: keys.map(k => ({Key: k}))}
            });
    }

    _getInvalidKeys(keys, ids) {
        const validKeys = ids.map(id => this._getKey(id));
        return _.reject(keys, k => validKeys.indexOf(k) >= 0);
    }

    _getKey(id) {
        return `${this._prefix}/${id}`;
    }

    _s3Helper() {
        return this._awsHelpers.s3({region: this._region});
    }
}

module.exports = S3OutputsStore;
