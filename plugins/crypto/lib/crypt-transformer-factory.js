'use strict';

const ObjectTransformer = require('./transformers/object-transformer');

class CryptTransformerFactory {

    constructor(params) {
        this._args = params.args;
        this._cryptTransformer = params.cryptTransformer;
    }

    createTransformer(typeOfValue) {
        const isObject = (typeOfValue === 'object');
        return isObject ? this._objectTransformer() : this._cryptTransformer;
    }

    _objectTransformer() {
        const keyPath = this._args.keyPath;
        const valueTransformer = this._cryptTransformer;
        return new ObjectTransformer({valueTransformer, options: {keyPath}});
    }
}

module.exports = CryptTransformerFactory;
