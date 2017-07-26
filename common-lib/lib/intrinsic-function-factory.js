'use strict';

const _ = require('lodash');
const JoinIntrinsicFunction = require('./join-intrinsic-function');

const FUNCTION_NAME_PREFIX = 'Fn::';

class IntrinsicFunctionFactory {

    create(value) {
        if (this._isIntrinsicFunction(value)) {
            const fnName = Object.keys(value)[0];
            const fnData = value[fnName];
            const creator = this._intrinsicFunctionCreators()[fnName];
            return creator ? creator.call(this, fnData) : this._throwUnsupportedError(fnName);
        }
        return this._createNullFunction(value);
    }

    _isIntrinsicFunction(value) {
        return typeof value === 'object' &&
            Object.keys(value).length === 1 &&
            Object.keys(value)[0].startsWith(FUNCTION_NAME_PREFIX);
    }

    _throwUnsupportedError(functionName) {
        throw new Error(`Unsupported function ${functionName}`);
    }

    _intrinsicFunctionCreators() {
        const creators = {
            Join: this._createJoinFunction
        };
        return _.reduce(creators, (r, v, k) =>
            Object.assign(r, {[`${FUNCTION_NAME_PREFIX}${k}`]: v}),
            {}
        );
    }

    _createJoinFunction(items) {
        return new JoinIntrinsicFunction({items});
    }

    _createNullFunction(value) {
        return {evaluate: () => value};
    }
}

module.exports = IntrinsicFunctionFactory;
