'use strict';

class CollectDataSourceData {

    constructor(params) {
        this._context = params.context;
        this._dataSourceFactory = params.dataSourceFactory;
    }

    execute(state) {
        return this._fetchDataFromAllDataSources().then(dataSourceData => {
            this._context.settings.addRefData({dataSourceData});
            return Object.assign({}, state, {dataSourceData});
        });
    }

    _fetchDataFromAllDataSources() {
        return this._context.settings.reduce(
            'dataSources', (combined, dataSourceDef, name) => {
                return this._fetchDataFromDataSource(dataSourceDef).then(
                    data => Object.assign(combined, {[name]: data})
                );
            }, {}
        );
    }

    _fetchDataFromDataSource(dataSourceDef) {
        const dataSource = this._dataSourceFactory.createDataSource(dataSourceDef);
        return dataSource.fetchData();
    }
}

module.exports = CollectDataSourceData;
