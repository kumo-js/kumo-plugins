'use strict';

const _ = require('lodash');
const AWSHelpers = require('../../../common-lib/lib/aws-helpers');
const S3DataSource = require('./data-sources/s3-data-source');

class DataSourceFactory {

    createDataSource(dataSourceDef) {
        const type = dataSourceDef.type;
        const createFn = this._dataSourceCreators()[type];
        if (!createFn) throw new Error(`Unsupported data source type ${type}`);
        return createFn.call(this, dataSourceDef);
    }

    _dataSourceCreators() {
        return {
            's3-bucket': this._createS3DataSource
        };
    }

    _createS3DataSource(dataSourceDef) {
        const awsHelpers = new AWSHelpers();
        const params = _.omit(dataSourceDef, ['type']);
        return new S3DataSource(Object.assign(params, {awsHelpers}));
    }
}

module.exports = DataSourceFactory;
