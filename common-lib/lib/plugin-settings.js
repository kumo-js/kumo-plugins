'use strict';

const _ = require('lodash');
const ObjectResolver = require('./object-resolver');

class PluginSettings {

    constructor(params) {
        this._settings = params.settings;
        this._refData = params.refData || {};
        this._objectResolver = new ObjectResolver();
    }

    addRefData(data) {
        Object.assign(this._refData, data);
    }

    extract(keyPath) {
        return this._resolveSettings().then(
            settings => _.get(settings, keyPath)
        );
    }

    reduce(keyPath, callback, initial) {
        return this._reduce(keyPath, callback, initial, this._forwardIterate());
    }

    reduceRight(keyPath, callback, initial) {
        return this._reduce(keyPath, callback, initial, this._reverseIterate());
    }

    _reduce(keyPath, callback, initial, iterate) {
        const getItems = settings => this._getAsCollection(settings, keyPath);
        const count = getItems(this._settings).length;
        let promise = Promise.resolve(initial);

        iterate(count, index => {
            promise = promise.then(result => {
                return this._resolveSettings()
                    .then(settings => getItems(settings)[index])
                    .then(item => [result].concat(item.asParams()))
                    .then(callbackParams => callback.apply(callback, callbackParams));
            });
        });
        return promise;
    }

    _getAsCollection(settings, keyPath) {
        const items = _.get(settings, keyPath);
        if (_.isArray(items)) {
            return items.map(item => ({
                asParams: () => [item]
            }));
        }
        if (_.isObject(items)) {
            return _.map(items, (value, key) => ({
                asParams: () => [value, key]
            }));
        }
        throw new Error(`KeyPath "${keyPath}" must be an array/object`);
    }

    _forwardIterate() {
        return (count, processIndex) => {
            for (let i = 0; i < count; i += 1) processIndex(i);
        };
    }

    _reverseIterate() {
        return (count, processIndex) => {
            for (let i = (count - 1); i >= 0; i -= 1) processIndex(i);
        };
    }

    _resolveSettings() {
        return this._objectResolver.resolve(this._settings, this._refData);
    }
}

module.exports = PluginSettings;
