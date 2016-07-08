'use strict';

const path = require('path');

class OutputsS3Store {

    constructor(params) {
        this._config = params.outputsS3Config;
        this._s3Helper = params.s3Helper;
    }

    collect() {
        return this._s3Helper.mergeContents([{
            Bucket: this._bucket().name,
            Prefix: this._bucket().prefix
        }]);
    }

    save(id, outputs) {
        return this._s3Helper.putObject({
            Bucket: this._bucket().name,
            Key: path.join(this._bucket().prefix, id),
            Body: JSON.stringify(outputs)
        });
    }

    remove(id) {
        return this._s3Helper.deleteObject({
            Bucket: this._bucket().name,
            Key: path.join(this._bucket().prefix, id)
        });
    }

    _bucket() {
        return this._config.bucket();
    }
}

module.exports = OutputsS3Store;
