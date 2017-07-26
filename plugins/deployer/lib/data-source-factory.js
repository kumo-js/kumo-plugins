'use strict';

const _ = require('lodash');
const AWSHelpers = require('../../../common-lib/lib/aws-helpers');
const S3DataSource = require('./data-sources/s3-data-source');

class DataSourceFactory {

    createDataSource(dataSource, state) {
        const type = dataSource.type;
        const createFn = this._dataSourceCreators()[type];
        if (!createFn) throw new Error(`Unsupported data source type ${type}`);
        return createFn.call(this, dataSource, state);
    }

    _dataSourceCreators() {
        return {
            's3-bucket': this._createS3DataSourceProvider
        };
    }

    _createS3DataSourceProvider(dataSource, _state) {
        const awsHelpers = new AWSHelpers();
        const params = _.pick(dataSource, ['bucket', 'key', 'region']);
        return new S3DataSource(Object.assign(params, {awsHelpers}));
    }
}

module.exports = DataSourceFactory;
