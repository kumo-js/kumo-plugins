'use strict';

const _ = require('lodash');

class ContextInitializer {

    constructor(params) {
        this._defaultContextInitializer = params.defaultContextInitializer;
    }

    initialize(context, actionParams) {
        return this._defaultContextInitializer.initialize(context, actionParams).then(
            context => Object.assign({}, context, {
                settings: this._getSettingsOrDefault(context)
            })
        );
    }

    _getSettingsOrDefault(context) {
        const defaultSettings = _.get(context.kumoSettings, 'secretKeeper.providers');
        return Object.assign({}, defaultSettings, context.settings);
    }
}

module.exports = ContextInitializer;
