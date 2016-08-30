'use strict';

const _ = require('lodash');
const inflect = require('i')();

class EnvVarsFormatter {

    constructor(params) {
        this._options = Object.assign({}, this._defaultOptions(), params.options);
    }

    format(envVars) {
        return _.reduce(envVars || {}, (result, v, k) => {
            const parts = [this._options.prefix, inflect.underscore(k).toUpperCase()];
            const newKey = _.compact(parts).join('_');
            return Object.assign(result, {[newKey]: v});
        }, {});
    }

    _defaultOptions() {
        return {prefix: 'KUMO'};
    }
}

module.exports = EnvVarsFormatter;
