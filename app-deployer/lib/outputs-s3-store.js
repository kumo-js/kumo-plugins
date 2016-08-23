'use strict';

const _ = require('lodash');

class OutputsS3Store {

    constructor(params) {
        this._config = params.outputsS3Config;
        this._awsHelpers = params.awsHelpers;
    }

    collect() {
        return this._s3Helper().mergeContents([{
            Bucket: this._bucket().name,
            Prefix: this._bucket().prefix
        }]);
    }

    save(id, outputs) {
        return this._s3Helper().putObject({
            Bucket: this._bucket().name,
            Key: this._getKey(id),
            Body: JSON.stringify(outputs)
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
            Bucket: this._bucket().name,
            Prefix: this._bucket().prefix
        });
    }

    _deleteObjects(keys) {
        return keys.length === 0 ?
            Promise.resolve() :
            this._s3Helper().deleteObjects({
                Bucket: this._bucket().name,
                Delete: {Objects: keys.map(k => ({Key: k}))}
            });
    }

    _getInvalidKeys(keys, ids) {
        const validKeys = ids.map(id => this._getKey(id));
        return _.reject(keys, k => validKeys.indexOf(k) >= 0);
    }

    _getKey(id) {
        return this._bucket().prefix + id;
    }

    _s3Helper() {
        return this._awsHelpers.s3({region: this._bucket().region});
    }

    _bucket() {
        return this._config.bucket();
    }
}

module.exports = OutputsS3Store;
