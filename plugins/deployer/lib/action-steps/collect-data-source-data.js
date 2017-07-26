'use strict';

const _ = require('lodash');

class CollectDataSourceData {

    constructor(params) {
        this._context = params.context;
        this._dataSourceFactory = params.dataSourceFactory;
        this._objectResolver = params.objectResolver;
    }

    execute(state) {
        return this._fetchDataFromAllDataSources(state).then(
            fetchedData => Object.assign({}, state, {
                dataSourceData: fetchedData.reduce(
                    (combined, data) => Object.assign(combined, data), {}
                )
            })
        );
    }

    _fetchDataFromAllDataSources(state) {
        return Promise.all(
            _.map(this._dataSourceDefs(), (dataSourceDef, name) =>
                this._fetchDataFromDataSource(dataSourceDef, name, state)
            )
        );
    }

    _fetchDataFromDataSource(dataSourceDef, name, state) {
        const refData = {deploymentConfig: state.deploymentConfig};
        return this._objectResolver.resolve(dataSourceDef, refData)
            .then(dataSourceDef => this._dataSourceFactory.createDataSource(dataSourceDef))
            .then(dataSource => dataSource.fetchData().then(data => ({[name]: data})));
    }

    _dataSourceDefs() {
        return this._context.settings.dataSources;
    }
}

module.exports = CollectDataSourceData;
