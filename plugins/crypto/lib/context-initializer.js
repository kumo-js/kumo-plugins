'use strict';

const _ = require('lodash');

class ContextInitializer {

    constructor(params) {
        this._defaultContextInitializer = params.defaultContextInitializer;
    }

    initialize(context, actionParams) {
        return this._initializeDefaults(context, actionParams).then(
            context => this._initializeSettings(context)
        );
    }

    _initializeDefaults(context, actionParams) {
        return this._defaultContextInitializer.initialize(context, actionParams);
    }

    _initializeSettings(context) {
        const defaultSettings = _.get(context.kumoSettings, 'crypto.profiles');
        const settings = Object.assign({}, defaultSettings, context.settings);
        return Object.assign({}, context, {settings});
    }
}

module.exports = ContextInitializer;
