'use strict';

const _  = require('lodash');

class CollectDataSourceData {

    constructor(params) {
        this._context = params.context;
        this._dataSourceFactory = params.dataSourceFactory;
    }

    execute(state) {
        return this._resolveDataSourceDefs()
            .then(dataSourceDefs => this._fetchAllData(dataSourceDefs))
            .then(dataSourceData => {
                this._context.settings.addRefData({dataSourceData});
                return Object.assign({}, state, {dataSourceData});
            });
    }

    _fetchAllData(dataSourceDefs) {
        const fetchAllData = _.map(dataSourceDefs, (dataSourceDef, name) => 
            this._fetchData(dataSourceDef, name).then(data => ({name, data}))
        )
        return Promise.all(fetchAllData).then(result => 
            result.reduce((combined, item) => 
                Object.assign(combined, {[item.name]: item.data}), {}
            )
        );
    }

    _fetchData(dataSourceDef, name) {
        const dataSource = this._dataSourceFactory.createDataSource(dataSourceDef);
        return dataSource.fetchData();
    }

    _resolveDataSourceDefs() {
        return this._context.settings.resolve('dataSources');
    }

}

module.exports = CollectDataSourceData;
