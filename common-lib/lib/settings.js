'use strict';

const _ = require('lodash');
const ObjectResolver = require('./object-resolver');

class Settings {

    constructor(params) {
        this._rawSettings = params.rawSettings;
        this._refData = params.refData || {};
        this._objectResolver = new ObjectResolver();
    }

    addRefData(data) {
        Object.assign(this._refData, data);
    }

    resolve(path) {
        return this._resolveValue(this._rawSettings).then(
            resolvedValue => _.get(resolvedValue, path)
        );
    }

    extractCollection(path) {
        const items = _.get(this._rawSettings, path, []);
        return items.map((item, index) => 
            this._createSection(`${path}[${index}]`)
        );
    }

    _createSection(path) {
        return new Section({
            path: path, 
            rawSettings: this._rawSettings, 
            resolveValue: this._resolveValue.bind(this)
        });
    }

    _resolveValue(rawSettings, refData) {
        const fullRefData = Object.assign({}, this._refData, refData);
        return this._objectResolver.resolve(rawSettings, fullRefData);
    }
}

class Section {

    constructor(params) {
        this._path = params.path;
        this._rawSettings = _.cloneDeep(params.rawSettings);
        this._resolveValue = params.resolveValue;
    }

    getValue() {
        return _.get(this._rawSettings, this._path);
    }

    resolve(refData) {
        return this._resolveValue(this._rawSettings, refData).then(
            resolvedSettings => _.get(resolvedSettings, this._path)
        );        
    }
}

module.exports = Settings;
