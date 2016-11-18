'use strict';

const _ = require('lodash');
const traverse = require('../../../../common-lib/lib/traverse');

class ObjectTransformer {

    constructor(params) {
        this._valueTransformer = params.valueTransformer;
        this._options = params.options || {};
    }

    transform(sourceObj) {
        const keyPath = this._validateKeyPath(sourceObj);
        const targetObj = keyPath ? _.get(sourceObj, keyPath, '') : sourceObj;
        return this._transformValues(targetObj).then(obj =>
            keyPath ? this._setObj(sourceObj, keyPath, obj) : obj
        );
    }

    _transformValues(obj) {
        return traverse.values(obj, value =>
            this._valueTransformer.transform(value)
        );
    }

    _setObj(obj, keyPath, value) {
        return _.merge({}, obj, _.set({}, keyPath, value));
    }

    _validateKeyPath(obj) {
        const keyPath = this._options.keyPath;
        const inValid = keyPath && !_.has(obj, keyPath);
        if (inValid) throw Error(`Invalid key path '${keyPath}'`);
        return keyPath;
    }
}

module.exports = ObjectTransformer;
