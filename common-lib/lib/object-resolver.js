'use strict';

const traverse = require('./traverse');
const IntrinsicFunctionFactory = require('./intrinsic-function-factory');
const JsonSchemaHelper = require('./json-schema-helper');

class ObjectResolver {

    constructor() {
        this._jsonSchemaHelper = new JsonSchemaHelper();
        this._intrinsicFunctionFactory = new IntrinsicFunctionFactory();
    }

    resolve(obj, refData, options) {
        return this._defRefObj(obj, refData, options).then(
            obj => this._evaluateIntrinsicFunctions(obj)
        );
    }

    _defRefObj(obj, refData, options) {
        return this._jsonSchemaHelper.derefWith(obj, refData, options);
    }

    _evaluateIntrinsicFunctions(obj) {
        return traverse.all(obj, value => {
            const intrinsicFunction = this._intrinsicFunctionFactory.create(value);
            return intrinsicFunction.evaluate();
        });
    }
}

module.exports = ObjectResolver;
