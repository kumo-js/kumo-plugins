'use strict';

const ModuleSettingsResolver = require('./module-settings-resolver');

class ContextInitializer {

    constructor(params) {
        this._defaultContextInitializer = params.defaultContextInitializer;
        this._fileReader = params.fileReader;
        this._jsonSchemaHelper = params.jsonSchemaHelper;
        this._wrapSettings = params.wrapSettings;
    }

    initialize(context, actionParams) {
        const state = {context, actionParams};
        return Promise.resolve(state)
            .then(state => this._loadDefaultContext(state))
            .then(state => this._resolveModuleSettings(state))
            .then(state => Object.assign({}, state.defaultContext, {settings: state.moduleSettings}));
    }

    _loadDefaultContext(state) {
        return this._defaultContextInitializer.initialize(state.context, state.actionParams)
            .then(defaultContext => Object.assign({}, state, {defaultContext}));
    }

    _resolveModuleSettings(state) {
        const resolver = new ModuleSettingsResolver({
            fileReader: this._fileReader,
            jsonSchemaHelper: this._jsonSchemaHelper,
            wrapSettings: this._wrapSettings
        });
        return resolver.resolve(state.defaultContext.settings, state.defaultContext.args)
            .then(moduleSettings => Object.assign({}, state, {moduleSettings}));
    }

}

module.exports = ContextInitializer;
